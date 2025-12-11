/**
 * @fileoverview MongoDB connection configuration for Tsuki Coffee backend.
 * This module initializes the MongoDB connection using mongoose.
 * It is imported by models and controllers to ensure a single connection instance.
 * 
 * Usage:
 *   const connectDB = require('./config/db');
 *   connectDB();
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file, if present
dotenv.config();

// Default MongoDB URI (for development/testing)
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/tsuki_coffee';

/**
 * Connects to MongoDB using mongoose.
 * Uses MONGO_URI from environment variables, or falls back to default.
 * Handles connection events and errors.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Deprecated in mongoose v6+
      // useFindAndModify: false, // Deprecated in mongoose v6+
    });

    // Connection successful
    console.log(`MongoDB connected: ${mongoURI}`);
  } catch (error) {
    // Connection failed
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle connection events for better reliability
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected.');
});

// Export the connectDB function for use in app.js and elsewhere
module.exports = connectDB;
