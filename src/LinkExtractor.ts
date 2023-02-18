import { Parser as HTMLParser } from "htmlparser2";
import { Links } from "./types";
import UrlNormalizer from "./UrlNormalizer";

export default class LinkExtractor {
  private links: Set<string>;
  private assets: Set<string>;
  private urlNormalizer: UrlNormalizer;

  constructor(url) {
    this.links = new Set();
    this.assets = new Set();
    this.urlNormalizer = new UrlNormalizer(url);
  }

  private isFollowableUrl(url: string): boolean {
    if (!url) return false;
    if (!url.trim().length) return false;
    if (url.startsWith("#")) return false; // Filter out hash URLs.
    if (url.startsWith("//")) return false;
    if (url.includes(":") && !url.includes("://")) return false;
    return true;
  }

  public parse(doc: string): Promise<Links> {
    return new Promise((resolve, reject) => {
      const parser = new HTMLParser(
        {
          onopentag: (tagName: string, attribs: any) => {
            if (tagName === "a") {
              const { href } = attribs;

              if (!this.isFollowableUrl(href)) return;

              const linkUrl = this.urlNormalizer.getAbsoluteUrl(href);

              if (
                linkUrl !== this.urlNormalizer.startUrl &&
                this.urlNormalizer.isInDomain(linkUrl)
              ) {
                this.links.add(linkUrl);
              }
            } else if (["link", "script", "img"].includes(tagName)) {
              const assetUrl = this.urlNormalizer.getAbsoluteUrl(
                attribs.href || attribs.src || ""
              );

              if (
                assetUrl !== this.urlNormalizer.startUrl &&
                this.urlNormalizer.isInDomain(assetUrl)
              ) {
                this.assets.add(assetUrl);
              }
            }
          },
          onerror: (err) => {
            console.error("An error occurred");
          },
          onend: () => {
            resolve({ links: this.links, assets: this.assets });
          },
        },
        { decodeEntities: true }
      );
      parser.write(doc);
      parser.end();
    });
  }
}
