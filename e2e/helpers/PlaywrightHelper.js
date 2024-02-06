'use strict';

// eslint-disable-next-line no-undef
const Helper = codecept_helper;
const helperName = 'Playwright';
class PlaywrightHelper extends Helper {

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    await page.waitForSelector(locator, 10);
    await Promise.all([
      page.waitForNavigation(0),
      await page.click(locator)
    ]);
  }

  async clickTab(tabTitle) {
    const page = this.helpers[helperName].page;
    const tabXPath = `//div[text()='${tabTitle}']`;
    const tabExists = !!(await page.waitForXPath(tabXPath, {timeout: 6000}));
    if (tabExists) {
      const clickableTab = await page.$x(tabXPath);
      await page.evaluate(el => {return el.click();}, clickableTab[0]);
    }
  }
}
module.exports = PlaywrightHelper;
