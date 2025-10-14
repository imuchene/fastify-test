import puppeteer, { KnownDevices } from 'puppeteer';

async function fetchFromMedium() {
  const url = 'https://medium.com/tag/nodejs';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.emulate(KnownDevices.iPad);
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForNetworkIdle({ idleTime: 3000 });

  const articles = await page.$$('article');

  for (const el of articles) {
    const title = await el
      .$eval('h2', (el) => el.textContent.trim())
      .catch(() => null);
    const url = await el.$eval('a', (el) => el.href).catch(() => null);

    if (title && url) {
      console.log(title, url);
    }
  }

  await browser.close();
}

fetchFromMedium();
