const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
       console.log('BROWSER_ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));
  
  try {
    await page.goto('https://gis-india-map.onrender.com', { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait a bit to ensure map loads 
    await new Promise(r => setTimeout(r, 2000));
    
    // Evaluate in page to click the Railway Stations toggle
    await page.evaluate(() => {
        // Find the label containing 'Railway Stations'
        const labels = Array.from(document.querySelectorAll('label'));
        const rs = labels.find(l => l.textContent.includes('Railway Stations'));
        if (rs) {
            rs.click();
            console.log("Clicked Railway Stations");
        }
        const ms = labels.find(l => l.textContent.includes('Metro Stations'));
        if (ms) {
            ms.click();
            console.log("Clicked Metro Stations");
        }
    });

    // Wait for data to fetch and render
    await new Promise(r => setTimeout(r, 4000));
    
  } catch(e) {
    console.log('Failed to load page:', e.message);
  }

  await browser.close();
})();
