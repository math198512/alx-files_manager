const express = require('express');
const routes = require('./routes');

// Create Express application
const app = express();

// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

// Load routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
