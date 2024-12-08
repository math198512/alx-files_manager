import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a new Redis client
    this.client = createClient({
      url: 'redis://localhost:6379' || process.env.REDIS_URL,
    });

    // Handle Redis connection errors
    // Logging errors to console helps with debugging and monitoring
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Attempt to connect to Redis server
    this.client.connect().catch(console.error);
  }

  /**
   * Check if the Redis connection is alive
   * @returns {boolean} - Connection status
   */
  isAlive() {
    // Check if the client is ready and connected
    return this.client.isOpen;
  }

  /**
   * Asynchronously get a value from Redis by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} - The value stored for the key or null
   */
  async get(key) {
    try {
      // Retrieve the value for the given key
      return await this.client.get(key);
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  /**
   * Asynchronously set a key-value pair in Redis with an expiration
   * @param {string} key - The key to store
   * @param {string} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<boolean>} - Success status of the operation
   */
  async set(key, value, duration) {
    try {
      // Store the key-value pair with the specified expiration
      await this.client.setex(key, duration, value);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  /**
   * Asynchronously delete a key from Redis
   * @param {string} key - The key to delete
   * @returns {Promise<boolean>} - Success status of the operation
   */
  async del(key) {
    try {
      // Delete the specified key
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
      return false;
    }
  }
}

// Create and export a singleton instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
