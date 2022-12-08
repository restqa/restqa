import Browser from "./services/browser.js";
import fileUrl from "file-url";

export default async function main(opt) {
  try {
    opt.report = fileUrl(opt.report);
    const browser = new Browser(opt);
    await browser.screenshot();
    await browser.close();
    return Promise.resolve(opt);
  } catch (err) {
    return Promise.reject(err);
  }
}
