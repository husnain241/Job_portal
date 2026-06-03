// Import mongoose — the library that talks to MongoDB
const mongoose = require('mongoose');

// Import our config so we get the MongoDB connection string
const { mongoUri } = require('./env');

// This function connects to MongoDB
// We make it async because connecting takes time (it's a network call)
const connectDB = async () => {
  try {
    // mongoose.connect() opens the connection to MongoDB Atlas
    const conn = await mongoose.connect(mongoUri);

    // If connection succeeds, log the host name so we know it worked
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    // process.exit(1) means "stop everything, something went wrong"
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Export the function so server.js can call it
module.exports = connectDB;