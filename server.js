import express from 'express';

import router from './routes';

// Create Express application
const app = express();

// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
