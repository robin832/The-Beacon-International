// Simple test endpoint - /api/test.js
module.exports = function handler(req, res) {
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
};
