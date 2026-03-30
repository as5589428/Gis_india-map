const express = require('express');
const router = express.Router();
const multer = require('multer');
const gisController = require('../controllers/gisController');

// Multer Storage Configuration for GIS File Uploads
const upload = multer({ dest: 'uploads/' });

// Upload GIS File (Shapefile, GeoJSON, KML)
router.post('/upload', upload.single('file'), gisController.uploadGISFile);

// GIS Analysis (Measurement, Centroid, etc.)
router.post('/analyze', gisController.analyzeGISData);

module.exports = router;
