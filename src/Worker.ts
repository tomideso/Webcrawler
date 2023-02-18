import LinkExtractor from "./LinkExtractor";
import { Links, urlGenerator } from "./types";
import fetch from "node-fetch";

export default class Worker {
  private siteMap = new Map();

  constructor(
    private startingUrl: string,
    private urlGeneratorList: Generator<urlGenerator>
  ) {}

  public setSiteMap(map: Map<string, Links>) {
    this.siteMap = map;
    return this;
  }
  public async run(result: Set<string>, visitedUrls: Set<string>) {
    for (let [url, index] of this.urlGeneratorList) {
      if (visitedUrls.has(url)) {
        continue;
      }

      try {
        const documentString = await fetch(url).then((res) => res.text());
        console.log(url + " fetched successfully");
        visitedUrls.add(url);

        await new LinkExtractor(this.startingUrl)
          .parse(documentString)
          .then(({ assets, links }) => {
            this.siteMap.set(url, { assets, links });
            links.forEach((link) => {
              result.add(link);
            });
          });
      } catch (error) {
        console.log("error fetching " + url);
      }
    }
  }
}
