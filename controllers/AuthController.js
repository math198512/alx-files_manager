import sha1 from 'sha1';
import dbClient from '../utils/db';

const getConnect = async (req, res) => {
  const { authorization } = await req.headers.authorization;
  res.status(400).json({ auth: authorization });
};

module.exports = { getConnect };
