import { tmpdir } from 'os';
import { promisify } from 'util';
import Queue from 'bull/lib/queue';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs';
import { join as joinPath } from 'path';
import mongoDBCore from 'mongodb/lib/core';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


const VALID_FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};
const ROOT_FOLDER_ID = 0;
const DEFAULT_ROOT_FOLDER = 'files_manager';
const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const fileQueue = new Queue('thumbnail generation');
const NULL_ID = Buffer.alloc(24, '0').toString('utf-8');

const isValidId = (id) => {
  const size = 24;
  let i = 0;
  const charRanges = [
    [48, 57], // 0 - 9
    [97, 102], // a - f
    [65, 70], // A - F
  ];
  if (typeof id !== 'string' || id.length !== size) {
    return false;
  }
  while (i < size) {
    const c = id[i];
    const code = c.charCodeAt(0);

    if (!charRanges.some((range) => code >= range[0] && code <= range[1])) {
      return false;
    }
    i += 1;
  }
  return true;
};

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  const userIdRedis = await redisClient.get(`auth_${token}`);
  if (userIdRedis) {
    const user = await (await dbClient.usersCollection()).findOne({ _id: ObjectId(userIdRedis) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  const name = req.body ? req.body.name : null;
  const type = req.body ? req.body.type : null;
  const parentId = req.body && req.body.parentId ? req.body.parentId : ROOT_FOLDER_ID;
  const isPublic = req.body && req.body.isPublic ? req.body.isPublic : false;
  const base64Data = req.body && req.body.data ? req.body.data : '';

  if (!name) {
    res.status(400).json({ error: 'Missing name' });
    return;
  }
  if (!type || !Object.values(VALID_FILE_TYPES).includes(type)) {
    res.status(400).json({ error: 'Missing type' });
    return;
  }
  if (!req.body.data && type !== VALID_FILE_TYPES.folder) {
    res.status(400).json({ error: 'Missing data' });
    return;
  }
  if ((parentId !== ROOT_FOLDER_ID) && (parentId !== ROOT_FOLDER_ID.toString())) {
    const file = await (await dbClient.filesCollection())
      .findOne({
        _id: new mongoDBCore.BSON.ObjectId(isValidId(parentId) ? parentId : NULL_ID),
      });

    if (!file) {
      res.status(400).json({ error: 'Parent not found' });
      return;
    }
    if (file.type !== VALID_FILE_TYPES.folder) {
      res.status(400).json({ error: 'Parent is not a folder' });
      return;
    }
  }
  const userId = user._id.toString();
  const baseDir = `${process.env.FOLDER_PATH || ''}`.trim().length > 0
    ? process.env.FOLDER_PATH.trim()
    : joinPath(tmpdir(), DEFAULT_ROOT_FOLDER);
  // default baseDir == '/tmp/files_manager'
  // or (on Windows) '%USERPROFILE%/AppData/Local/Temp/files_manager';
  const newFile = {
    userId: new mongoDBCore.BSON.ObjectId(userId),
    name,
    type,
    isPublic,
    parentId: (parentId === ROOT_FOLDER_ID) || (parentId === ROOT_FOLDER_ID.toString())
      ? '0'
      : new mongoDBCore.BSON.ObjectId(parentId),
  };
  await mkDirAsync(baseDir, { recursive: true });
  if (type !== VALID_FILE_TYPES.folder) {
    const localPath = joinPath(baseDir, uuidv4());
    await writeFileAsync(localPath, Buffer.from(base64Data, 'base64'));
    newFile.localPath = localPath;
  }
  const insertionInfo = await (await dbClient.filesCollection())
    .insertOne(newFile);
  const fileId = insertionInfo.insertedId.toString();
  // start thumbnail generation worker
  if (type === VALID_FILE_TYPES.image) {
    const jobName = `Image thumbnail [${userId}-${fileId}]`;
    fileQueue.add({ userId, fileId, name: jobName });
  }
  res.status(201).json({
    id: fileId,
    userId,
    name,
    type,
    isPublic,
    parentId: (parentId === ROOT_FOLDER_ID) || (parentId === ROOT_FOLDER_ID.toString())
      ? 0
      : parentId,
  });
};

module.exports = { postUpload };
