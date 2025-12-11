/**
 * @fileoverview Entry point for Tsuki Coffee backend application.
 * Initializes Express server, connects to MongoDB, sets up middleware, and registers routes.
 * All configuration is modular and follows Google-style and best practices for maintainability.
 *
 * Usage:
 *   node app.js
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import route modules
const memberRoutes = require("./routes/memberRoutes");
const productRoutes = require("./routes/productRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Load environment variables from .env file, if present
dotenv.config();

// Set default port if not specified in environment
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware: Enable CORS for all origins (can be restricted as needed)
app.use(cors());

// Middleware: Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running." });
});

// Register API routes
app.use("/members", memberRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global error handler (for uncaught errors)
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Tsuki Coffee backend server is running on port ${PORT}`);
});

module.exports = app;
