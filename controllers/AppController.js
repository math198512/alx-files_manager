const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  // Handler for GET /status endpoint
  static async getStatus(req, res) {
    // Check Redis and DB client connection status
    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    // Return status with connection information
    return res.status(200).json({
      redis: redisAlive,
      db: dbAlive,
    });
  }

  // Handler for GET /stats endpoint
  static async getStats(req, res) {
    // Count users and files in the database
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    // Return statistics
    return res.status(200).json({
      users: usersCount,
      files: filesCount,
    });
  }
}

module.exports = AppController;
