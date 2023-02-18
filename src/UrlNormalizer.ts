export default class UrlNormalizer {
  public urlObject: URL;

  constructor(public startUrl) {
    //adds protocol and force prefix with www.
    if (!startUrl.includes("://")) {
      this.startUrl = `https://www.${startUrl.replace("www.", "")}`;
    }

    this.startUrl = this.removeTrailingSlash();
    this.urlObject = new URL(this.startUrl);
  }

  public removeTrailingSlash(url: string = this.startUrl): string {
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }
    return url;
  }

  public getAbsoluteUrl(url: string): string {
    if (url.includes("://")) return this.removeTrailingSlash(url);
    if (url.includes(":") && !url.includes("://")) return url;
    return this.removeTrailingSlash(
      `${this.urlObject.protocol}//${this.urlObject.hostname}${url}`
    );
  }

  public isInDomain(url): boolean {
    return this.urlObject.hostname == new URL(url).hostname;
  }
}
