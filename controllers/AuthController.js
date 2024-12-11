import sha1 from 'sha1';
import dbClient from '../utils/db';

const getConnect = (req, res) => {
  const { authorization } = req;
  console.log(authorization);
};

module.exports = { getConnect };
