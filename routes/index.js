// eslint-disable-next-line no-unused-vars
import { Router } from 'express';
import { getStats, getStatus } from '../controllers/AppController';

const router = Router();


// Define routes
router.get('/stats', getStats);
router.get('/status', getStatus);

export default router;
