import mapRoutes from './routes';

const express = require('express');

// Create Express application
const app = express();

// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

mapRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
