import Parser from 'rss-parser';

const parser = new Parser();
const urls = [
  'https://www.bonappetit.com/feed/recipes-rss-feed/rss',
  'https://www.budgetbytes.com/category/recipes/feed/',
  'https://www.reddit.com/r/recipes/.rss',
];

async function main() {
  const feedItems: any[] = [];
  const awaitableRequests = urls.map((url) => parser.parseURL(url));

  const responses = await Promise.all(awaitableRequests);
  aggregate(responses, feedItems);
  print(feedItems);
}

function aggregate(responses: any, feedItems: any[]) {
  for (const { items } of responses) {
    for (const { title, link } of items) {
      if (title.toLowerCase().includes('chicken')) {
        feedItems.push({ title, link });
      }
    }
  }
  return feedItems;
}

function print(feedItems: any) {
  console.clear();
  console.table(feedItems);
  console.log('Last Updated', new Date().toUTCString());
}

// setInterval(main, 2000);

main();
