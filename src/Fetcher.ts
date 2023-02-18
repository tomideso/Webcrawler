import { Links, urlGenerator } from "./types";
import Worker from "./Worker";

export default class Fetcher {
  private siteMap: Map<string, Links> = new Map();
  constructor(private startingUrl: string, private urls: string[]) {}

  public setSiteMap(map: Map<string, Links>) {
    this.siteMap = map;
    return this;
  }

  *getUrlListGenerator(urls: Array<string>): Generator<urlGenerator> {
    for (let index = 0; index < urls.length; index++) {
      const currentValue = urls[index];
      yield [currentValue, index];
    }
  }

  public async run(
    visitedUrls: Set<string>,
    concurrency: number = 10
  ): Promise<Array<string>> {
    const gen = this.getUrlListGenerator(this.urls);

    concurrency = Math.min(concurrency, this.urls.length);

    const workers = new Array(concurrency);
    const result = new Set<string>();

    for (let i = 0; i < concurrency; i++) {
      workers.push(
        new Worker(this.startingUrl, gen)
          .setSiteMap(this.siteMap)
          .run(result, visitedUrls)
      );
    }
    await Promise.all(workers);

    return [...result].filter((link) => !visitedUrls.has(link));
  }
}
