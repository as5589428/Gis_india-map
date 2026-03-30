const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 15000 });
    // Wait a bit to ensure map loads and features are parsed
    await new Promise(r => setTimeout(r, 2000));
  } catch(e) {
    console.log('Failed to load page:', e.message);
  }

  await browser.close();
})();
