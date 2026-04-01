const https = require('https');
const fs = require('fs');
const path = require('path');

const query = `
[out:json][timeout:25];
(
  node["man_made"="storage_tank"]["content"="water"](20.95,78.95,21.25,79.20);
  way["man_made"="storage_tank"]["content"="water"](20.95,78.95,21.25,79.20);
  node["man_made"="water_tower"](20.95,78.95,21.25,79.20);
  way["man_made"="water_tower"](20.95,78.95,21.25,79.20);
  node["amenity"="drinking_water"](20.95,78.95,21.25,79.20);
);
out center;
`;

const postData = 'data=' + encodeURIComponent(query);

const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const geojson = {
        type: 'FeatureCollection',
        features: json.elements.map(el => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          if (!lat || !lon) return null;
          return {
            type: 'Feature',
            properties: {
              name: el.tags?.name || 'Water Storage',
              type: el.tags?.man_made || el.tags?.amenity || 'water_facility',
              capacity: el.tags?.capacity || ''
            },
            geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            }
          };
        }).filter(f => f !== null)
      };
      
      const file = "g:\\india-gis\\backend\\data\\water_tanks_nagpur.json";
      fs.writeFileSync(file, JSON.stringify(geojson, null, 2));
      console.log('Saved ' + geojson.features.length + ' features to ' + file);
    } catch (e) {
      console.error(e, data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
