import Parser from 'rss-parser';
import promptModule from 'prompt-sync';

const parser = new Parser();

interface FeedType {
  title: string | undefined;
  link: string | undefined;
}

const urls = [
  'https://www.bonappetit.com/feed/recipes-rss-feed/rss',
  'https://www.budgetbytes.com/category/recipes/feed/',
  'https://www.reddit.com/r/recipes/.rss',
];

const prompt = promptModule({ sigint: true });
const customItems: FeedType[] = [];

async function main() {
  const feedItems: FeedType[] = [];
  const awaitableRequests = urls.map((url) => parser.parseURL(url));
  const responses = await Promise.all(awaitableRequests);

  aggregate(responses, feedItems);
  print(feedItems);
}

function aggregate(responses: any, feedItems: FeedType[]) {
  for (const { items } of responses) {
    for (const { title, link } of items) {
      if (title.toLowerCase().includes('chicken')) {
        feedItems.push({ title, link });
      }
    }
  }
  return feedItems;
}

function print(feedItems: FeedType[]) {
  const res = prompt('Add item: ');
  const [title, link] = res.split(',');
  if (![title, link].includes(undefined)) customItems.push({ title, link });

  console.clear();
  console.table(feedItems.concat(customItems));
  console.log('Last Updated', new Date().toUTCString());
}

main();
