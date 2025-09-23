import Parser from "rss-parser";

const parser = new Parser();

async function main(){
  const url = 'https://www.bonappetit.com/feed/recipes-rss-feed/rss';
  const response = await fetch(url);
  console.log('response', await response.text());
}

main();