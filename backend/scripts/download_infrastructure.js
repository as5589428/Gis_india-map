const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const urls = [
  {
    url: 'https://raw.githubusercontent.com/datameet/railways/master/tracks.json',
    dest: 'railway_network.json',
    type: 'json'
  },
  {
    url: 'https://s3.dualstack.us-east-1.amazonaws.com/production-raw-data-api/ISO3/IND/health_facilities/points/hotosm_ind_health_facilities_points_geojson.zip',
    dest: 'hospitals_temp.zip',
    type: 'zip',
    extractFile: 'hotosm_ind_health_facilities_points.geojson',
    finalDest: 'hospitals.json'
  },
  {
    url: 'https://s3.dualstack.us-east-1.amazonaws.com/production-raw-data-api/ISO3/IND/education_facilities/points/hotosm_ind_education_facilities_points_geojson.zip',
    dest: 'schools_temp.zip',
    type: 'zip',
    extractFile: 'hotosm_ind_education_facilities_points.geojson',
    finalDest: 'schools.json'
  }
];

const dataDir = path.join(__dirname, '..', 'data');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function processAll() {
  for (const item of urls) {
    const destPath = path.join(dataDir, item.dest);
    try {
      await downloadFile(item.url, destPath);
      console.log(`Successfully downloaded ${item.dest}`);
      
      if (item.type === 'zip') {
        console.log(`Extracting ${item.dest}...`);
        // Use PowerShell to extract
        execSync(`powershell Expand-Archive -Path "${destPath}" -DestinationPath "${dataDir}" -Force`);
        
        const extractedPath = path.join(dataDir, item.extractFile);
        const finalDestPath = path.join(dataDir, item.finalDest);
        
        if (fs.existsSync(extractedPath)) {
          fs.copyFileSync(extractedPath, finalDestPath);
          fs.unlinkSync(extractedPath);
          console.log(`Successfully extracted and renamed to ${item.finalDest}`);
        } else {
          console.error(`Expected extracted file not found: ${extractedPath}`);
        }
        
        // Clean up zip
        fs.unlinkSync(destPath);
      }
    } catch (err) {
      console.error(`Error processing ${item.dest}:`, err);
    }
  }
  console.log('All downloads finished.');
}

processAll();
