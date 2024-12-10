import dbClient from '../utils/db';
import sha1 from 'sha1'


const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined) return res.status(400).json({ error: 'Missing email' });
  if (password === undefined) return res.status(400).json({ error: 'Missing password' });
  try {
    const hashedPass = sha1(password);
    const result = await dbClient.insertOne('users', { email, password: hashedPass });
    return res.status(201).json({ id: result.insertedId, email });
  }
  catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Already exist' });
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  };
}




module.exports = { postNew };
