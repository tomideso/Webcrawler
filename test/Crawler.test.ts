import Crawler from "../src/Crawler";
import { expect, test } from "@jest/globals";

const testUrl = "http://127.0.0.1:5500/test/home.html";

test(`crawl ${testUrl}`, async () => {
  const crawler = new Crawler(testUrl);
  await crawler.init();

  expect(crawler.sitemap.has(testUrl)).toBeTruthy();

  for (let [url, links] of crawler.sitemap) {
    expect(links.links.has("http://127.0.0.1/newsletter")).toBeTruthy();
    expect(links.links.has("http://127.0.0.1/about")).toBeTruthy();
    expect(links.assets.has("http://127.0.0.1/image.png")).toBeTruthy();
  }
});
