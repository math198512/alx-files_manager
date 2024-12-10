import dbClient from '../utils/db';
import sha1 from 'sha1'


const postNew = async (req, res) => {
  const email = req.body ? req.body.email : null;
  const password = req.body ? req.body.password : null;

  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Missing password' });
    return;
  }
  const user = await dbClient.findOne({ email });

  if (user) {
    res.status(400).json({ error: 'Already exist' });
    return;
  }
  const insertionInfo = await dbClient.collection('users').insertOne({ email, password: sha1(password) });
  const userId = insertionInfo.insertedId.toString();

  res.status(201).json({ email, id: userId });
}

module.exports = { postNew };
