const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');
const { clientUrl } = require('./config/env');

const app = express();

// ── SECURITY MIDDLEWARES ──────────────────────────────────────────
// helmet adds ~15 security-related HTTP headers automatically
app.use(helmet());

// cors allows your frontend (running on a different port/domain) to call the API
app.use(cors({
  origin: clientUrl,
  credentials: true, // allow cookies to be sent cross-origin
}));

// ── BODY PARSERS ─────────────────────────────────────────────────
app.use(express.json());              // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());              // parse cookies

// ── STATIC FILES ─────────────────────────────────────────────────
// Makes the uploads folder publicly accessible via URL
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── SWAGGER DOCS ─────────────────────────────────────────────────
try {
  const swaggerDocument = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.log('Swagger file not found, skipping docs');
}

// ── HEALTH CHECK ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// ── API ROUTES ───────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 HANDLER ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── CENTRAL ERROR HANDLER ─────────────────────────────────────────
// Must be LAST — Express identifies error middleware by 4 params
app.use(errorMiddleware);

module.exports = app;