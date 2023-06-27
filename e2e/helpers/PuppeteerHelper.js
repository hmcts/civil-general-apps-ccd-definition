'use strict';

// eslint-disable-next-line no-undef
const Helper = codecept_helper;
const helperName = 'Puppeteer';
class PuppeteerHelper extends Helper {

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    await page.waitForSelector(locator, {visible: true});
    await page.click(locator);
    await page.waitForNavigation();
  }
}
module.exports = PuppeteerHelper;
