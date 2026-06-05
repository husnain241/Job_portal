const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/env');
const fs = require('fs');

// Create uploads folder if it doesn't exist
// This runs before the server starts
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('uploads/resumes')) fs.mkdirSync('uploads/resumes', { recursive: true });

// Connect to MongoDB first, then start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📄 API Docs at http://localhost:${port}/api-docs`);
  });
}).catch((err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});