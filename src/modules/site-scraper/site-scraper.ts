import { HttpError } from '@fastify/sensible';
import { load } from 'cheerio';

async function fetchFromMedium() {
  const url = 'https://medium.com/tag/nodejs';

  try {
    const response = await fetch(url);
    const text = await response.text();

    const $ = load(text);
    const elements = $('article');
    elements.each((i, element) => {
      const title = $(element).find('h2').text();
      const url = $(element).find('a').attr('href');
      console.log(title, url)
    });
  } catch (error) {
    if (error instanceof HttpError) {
      console.error('error', error.message);
    }
  }
}

fetchFromMedium();
