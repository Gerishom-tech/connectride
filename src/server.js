const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ConnectRide API is running!',
    version: '1.0.0',
    location: 'Kigali, Rwanda'
  });
});

// Import dispatch routes
const dispatchRouter = require('./dispatch');
app.use('/api/dispatch', dispatchRouter);

app.listen(PORT, () => {
  console.log(`🛵 ConnectRide server running on port ${PORT}`);
  console.log(`📍 Location: Kigali, Rwanda`);
  console.log(`🌐 Open: http://localhost:${PORT}`);
});