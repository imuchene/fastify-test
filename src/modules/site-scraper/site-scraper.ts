import { HttpError } from '@fastify/sensible';
import { load } from 'cheerio';

async function fetchFromMedium() {
  const url = 'https://medium.com/tag/nodejs';

  try {
    const response = await fetch(url);
    const text = await response.text();

    const $ = load(text);
    const elements = $('article h2');
    elements.each((i, element) => {
      console.log($(element).text())
    });
  } catch (error) {
    if (error instanceof HttpError) {
      console.error('error', error.message);
    }
  }
}

fetchFromMedium();
