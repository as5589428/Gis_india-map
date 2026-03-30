const express = require('express');
const router = express.Router();
const layerController = require('../controllers/layerController');

// Get all layers (Toggles)
router.get('/', layerController.getLayers);

// Get specific layer GeoJSON (States, Districts, etc.)
router.get('/:layerId', layerController.getLayerGeoJSON);

module.exports = router;
