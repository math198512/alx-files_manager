// eslint-disable-next-line no-unused-vars
import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Define routes
router.get('/stats', AppController.getStats);
router.get('/status', AppController.getStatus);
router.post('/users', UsersController.postNew);

export default router;
