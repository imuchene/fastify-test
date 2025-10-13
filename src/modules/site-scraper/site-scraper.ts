import { HttpError } from '@fastify/sensible';

async function fetchFromMedium() {
  const url = 'https://medium.com/tag/nodejs';

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('text', text);
  } catch (error) {
    if (error instanceof HttpError) {
      console.error('error', error.message);
    }
  }
}

fetchFromMedium();
