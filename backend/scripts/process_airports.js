const fs = require('fs');
const path = require('path');

const csvPath = 'C:/Users/sansk/.gemini/antigravity/brain/0f547726-7e78-459d-842c-3b0abadc472b/.system_generated/steps/1081/content.md';
const outputPath = 'g:/india-gis/backend/data/airports.json';

try {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  
  // Find header line (id,ident,type,name,...)
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('id,ident,type,name')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    console.error('Header not found');
    process.exit(1);
  }

  const headers = lines[headerIndex].split(',');
  const features = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser for this specific file (handles quotes)
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else current += char;
    }
    values.push(current);

    const airport = {};
    headers.forEach((h, index) => {
      airport[h] = values[index];
    });

    const lat = parseFloat(airport.latitude_deg);
    const lon = parseFloat(airport.longitude_deg);

    if (!isNaN(lat) && !isNaN(lon)) {
      features.push({
        type: 'Feature',
        properties: {
          name: airport.name,
          city: airport.municipality,
          type: airport.type,
          iata: airport.iata_code,
          gps: airport.gps_code
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      });
    }
  }

  const geojson = {
    type: 'FeatureCollection',
    features: features
  };

  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  console.log(`Successfully processed ${features.length} airports.`);
} catch (err) {
  console.error('Error:', err);
}
