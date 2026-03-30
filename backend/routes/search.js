const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search Route - Proxies to Nominatim / OSM with Indian Context
router.get('/', searchController.searchLocation);

module.exports = router;
