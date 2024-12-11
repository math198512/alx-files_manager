import sha1 from 'sha1';
import dbClient from '../utils/db';

const getConnect = async (req, res) => {
  const { authorization } = await req;
  console.log(authorization);
};

module.exports = { getConnect };
