import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.log('UNCAUGHT EXCEPTION:', err.toString());
    });

    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });

    // get the body HTML
    const content = await page.content();
    fs.writeFileSync('body.html', content);
    console.log('Saved to body.html');

    await browser.close();
})();
