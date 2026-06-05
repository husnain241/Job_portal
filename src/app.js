const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger (optional — won't crash if file missing)
try {
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  // swagger.yaml not found — skip silently
}

// Health check
app.get('/health', function(req, res) {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// All API routes
app.use('/api', routes);

// 404 handler
app.use(function(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ⚠️ ERROR MIDDLEWARE — must be last, must have exactly 4 params
app.use(errorMiddleware);

module.exports = app;