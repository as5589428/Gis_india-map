const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (Fallback to local if no URI provided)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/india_gis';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Ready for GIS Data'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Multer Storage Configuration for GIS File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Import Routes
const searchRoutes = require('./routes/search');
const layerRoutes = require('./routes/layers');
const gisRoutes = require('./routes/gis');

// Use Routes
app.use('/api/search', searchRoutes);
app.use('/api/layers', layerRoutes);
app.use('/api/gis', gisRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('🇮🇳 India Web GIS Server is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 GIS Server live at http://localhost:${PORT}`);
});
