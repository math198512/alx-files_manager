// eslint-disable-next-line no-unused-vars
import { Express } from 'express';
import { getStatus, getStats } from '../controllers/AppController';

// Define routes
const mapRoutes = (app) => {
  app.get('/status', getStatus);
  app.get('/stats', getStats);
}

export default mapRoutes;
