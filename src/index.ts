import Crawler from "./Crawler";

const args = process.argv;

if (args.length !== 3 || (args.length > 2 && !args[2].trim().length)) {
  console.error("Usage: npm start <site-to-crawl>");
  process.exit(1);
}

const input = args[2];
const crawler = new Crawler(input, 1);

crawler.init().then(console.log);
