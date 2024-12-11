import sha1 from 'sha1';
import dbClient from '../utils/db';

const getConnect = (req, res) => {
  const { authorization } = req;
  res.status(200).json({ 'authorization': authorization });;
};

module.exports = { getConnect };
