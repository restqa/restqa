import puppeteer from "puppeteer";

export default class {
  constructor(options) {
    this._options = options;
    this._browser = null;
  }

  get page() {
    return this._options.report;
  }

  get hash() {
    return this._options.hash;
  }

  get element() {
    return this._options.element;
  }

  get filename() {
    return this._options.export;
  }

  get readyWaitFor() {
    return this._options.waitfor;
  }

  get pauseTimeout() {
    return this._options.pause;
  }

  get config() {
    return {
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: [`--window-size=1920,1080`],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    };
  }

  async screenshot() {
    this._browser = await puppeteer.launch(this.config);
    const page = await this._browser.newPage();
    await page.goto(this.page);
    await page.waitForSelector(this.readyWaitFor);
    await page.evaluate((hash) => {
      location.hash = hash;
    }, this.hash);
    await page.waitForTimeout(this.pauseTimeout);
    const element = await page.$(this.element);
    return element.screenshot({
      path: this.filename,
      type: "png"
    });
  }

  async close() {
    this._browser && (await this._browser.close());
  }
}
