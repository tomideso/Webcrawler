import Fetcher from "./Fetcher";
import { Links } from "./types";
import UrlNormalizer from "./UrlNormalizer";

export default class Crawler {
  private startUrl: string;
  private depth: number;
  public sitemap: Map<string, Links> = new Map();
  private depthReached: number = 0;

  constructor(url: string, depth = 2) {
    this.depth = depth;
    this.startUrl = new UrlNormalizer(url).startUrl;
  }

  public init(visitedUrls: Set<string> = new Set()) {
    return new Promise((resolve, reject) => {
      if (!this.startUrl?.length) return reject();

      const startingUrl = this.startUrl.toString();

      console.log("starting crawl");

      const runFetcher = async (followUrls) => {
        try {
          const resolvedLinks = await new Fetcher(startingUrl, followUrls).setSiteMap(this.sitemap).run(visitedUrls);

          this.depthReached++;

          if (resolvedLinks.length < 1 || this.depthReached == this.depth) {
            return resolve(this.sitemap);
          }

          runFetcher([...resolvedLinks]);
        } catch (error) {
          console.log("error", error);
        }
      };

      runFetcher([startingUrl]);
    });
  }
}
