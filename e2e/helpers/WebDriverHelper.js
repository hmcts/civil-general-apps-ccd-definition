'use strict';

// eslint-disable-next-line no-undef
const Helper = codecept_helper;
class WebDriverHelper extends Helper {

  async waitForNavigationToComplete(locator, webDriverWait = 7) {
    const helper = this.helpers.WebDriver;

    if (locator) {
      await helper.waitForClickable(locator, 30);
      await helper.click(locator);
    }
    await helper.wait(webDriverWait);
  }
}

module.exports = WebDriverHelper;
