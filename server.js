const express = require('express');

// Create an Express application
const app = express();

// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at: http://localhost:${PORT}`);
});
