const gisService = require('../services/gisService');

exports.uploadGISFile = async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Process Shapefile / GeoJSON / KML
    // For now, handling Shapefile parsing using our service
    const geojson = await gisService.processShapefile(file.path);
    res.json({ message: 'File processed successfully', data: geojson });
  } catch (error) {
    console.error('File Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to process GIS file' });
  }
};

exports.analyzeGISData = (req, res) => {
  const { geojson, action } = req.body;

  if (!geojson) {
    return res.status(400).json({ error: 'GIS data is required for analysis' });
  }

  try {
    let result;
    switch (action) {
      case 'area':
        result = gisService.calculateArea(geojson);
        break;
      case 'distance':
        const { coords1, coords2 } = req.body;
        result = gisService.calculateDistance(coords1, coords2);
        break;
      default:
        return res.status(400).json({ error: 'Invalid analysis action' });
    }
    res.json({ result });
  } catch (error) {
    console.error('GIS Analysis Error:', error.message);
    res.status(500).json({ error: 'Failed to perform GIS analysis' });
  }
};
