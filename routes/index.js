// eslint-disable-next-line no-unused-vars
import { Router } from 'express';

import { getStatus, getStats } from '../controllers/AppController';

const router = Router();

// Define routes
router.get('/status', getStatus);
router.get('/stats', getStats);

export default router;
