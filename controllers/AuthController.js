import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';

const getConnect = async (req, res) => {
  const { user } = req;
  const token = uuidv4();

  await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
  res.status(200).json({ token });
}

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];

  await redisClient.del(`auth_${token}`);
  res.status(204).send();
}

module.exports = { getConnect, getDisconnect };
