import Parser from "rss-parser";

const parser = new Parser();

async function main(){
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  const { title, items } = await parser.parseURL(url);
  console.log('title', title);

  const results = items.map(({title, link}) => ({ title, link }));
  console.table(results);
}

main();