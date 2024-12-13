import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${token}`);
  if (userId) {
    const user = await (await dbClient.usersCollection()).findOne({ _id: ObjectId(userId) });
    if (user) {
      const fileName = req.body.name;
      const fileType = req.body.type;
      return res.status(200).json({ fileName, fileType });
    }
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = { postUpload };
