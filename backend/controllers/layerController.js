const path = require('path');
const fs = require('fs');

// Mock list of layers
const layersList = [
  { id: 'india_boundary', name: 'India Boundary', type: 'GeoJSON' },
  { id: 'state_boundary', name: 'State Boundaries', type: 'GeoJSON' },
  { id: 'district_boundary', name: 'District Boundaries', type: 'GeoJSON' },
  { id: 'metro_network', name: 'Metro Rail Lines', type: 'GeoJSON' },
  { id: 'railway_network', name: 'Railway Network', type: 'GeoJSON' },
  { id: 'railway_stations', name: 'Railway Stations', type: 'GeoJSON' },
  { id: 'metro_stations', name: 'Metro Stations', type: 'GeoJSON' },
  { id: 'airports', name: 'Major Airports', type: 'GeoJSON' },
  { id: 'hospitals', name: 'Hospitals Registry', type: 'GeoJSON' },
  { id: 'schools', name: 'Schools Registry', type: 'GeoJSON' },
];

exports.getLayers = (req, res) => {
  res.json(layersList);
};

exports.getLayerGeoJSON = (req, res) => {
  const { layerId } = req.params;
  const filePath = path.join(__dirname, '../data', `${layerId}.json`);

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } else {
    // Return empty placeholder for now, so app doesn't crash
    res.json({ type: "FeatureCollection", features: [] });
  }
};
