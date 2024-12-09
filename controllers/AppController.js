import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getStatus = (req, res) => {
  res.status(200).json({ redis: redisCleint.isAlive(), db: dbClient.isAlive() });
};

const getStats = async (req, res) => {
  res.status(200).json({ users: await dbClient.nbUsers(), files: await dbClient.nbFiles() });
};

module.exports = { getStats, getStatus };
