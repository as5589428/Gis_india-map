const shapefile = require('shapefile');
const turf = require('@turf/turf');

exports.processShapefile = async (filePath) => {
  try {
    const geojson = await shapefile.read(filePath);
    return geojson;
  } catch (error) {
    console.error('Shapefile processing error:', error);
    throw error;
  }
};

exports.calculateArea = (geojson) => {
  return turf.area(geojson);
};

exports.calculateDistance = (coords1, coords2) => {
  const from = turf.point(coords1);
  const to = turf.point(coords2);
  return turf.distance(from, to, { units: 'kilometers' });
};
