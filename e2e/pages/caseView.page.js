const config = require('../config');
const I = actor();

module.exports = {

  tabs: {
    summary: 'Summary',
    claimDetails: 'Claim details',
    history: 'History',
    Applications: 'Applications'
  },
  fields: {
    eventDropdown: '#next-step',
    tab: 'div.mat-tab-label-content',
    spinner: 'div.spinner-container',
    caseHeader: 'ccd-case-header > h1',
    generalApps: 'h1.govuk-heading-l',
    tabList: 'div.mat-tab-list',
    selectedTab: 'div[aria-selected="true"] div[class*="content"]',
    caseViewerLabel: '.Summary .case-viewer-label',
    signOutLink: 'ul[class*="navigation-list"] a',
  },
  goButton: 'button[type="submit"]',

  async start(event) {
    switch (event) {
      case 'Make decision':
      case 'Make an application':
      case 'Respond to application':
      case 'Respond to judges written rep':
      case 'Respond to judges directions':
      case 'Respond to judges addn info':
      case 'Respond to judges list for hearing':
      case 'Refer to Judge':
      case 'Refer to Legal Advisor':
      case 'Make an order':
      case 'Approve Consent Order':
        await I.waitForSelector(this.fields.eventDropdown, 20);
        await I.selectOption(this.fields.eventDropdown, event);
        await I.retryUntilExists(async () => {
          await I.forceClick(this.goButton);
        }, this.fields.generalApps);
        break;
      default:
        await I.waitForClickable('.event-trigger .button', 10);
        await I.retryUntilExists(async () => {
          await I.forceClick(this.goButton);
        }, this.fields.generalApps);
    }
  },

  async startEvent(event, caseId) {
    await I.retryUntilExists(async () => {
      await I.navigateToCaseDetails(caseId);
      await this.start(event);
    }, locate(this.fields.generalApps));
  },

  async assertNoEventsAvailable() {
    if (await I.hasSelector(this.fields.eventDropdown)) {
      throw new Error('Expected to have no events available');
    }
  },

  async verifySummaryPage() {
    await I.waitForText('Summary', 15, this.fields.selectedTab);
    await I.seeTextEquals('Type of claim', locate(this.fields.caseViewerLabel).first());
  },

  async clickOnTab(tabName) {
    await I.waitForSelector(this.fields.tabList, 5);
    await I.refreshPage();
    if (['preview'].includes(config.runningEnv)) {
      await I.wait(5);
    } else if (['aat', 'demo'].includes(config.runningEnv)) {
      await I.wait(10);
    } else {
      await I.wait(3);
    }
    await I.waitForSelector(this.fields.signOutLink, 30);
    await I.clickTab(tabName);
    await I.waitForText(tabName, 10, this.fields.selectedTab);
  },

  async clickMainTab(tabName) {
    await I.waitForElement(this.fields.tabList, 10);
    await I.forceClick(locate(this.fields.tab).withText(tabName));
    await I.waitForText(tabName, 10, this.fields.selectedTab);
  },

  async navigateToTab(caseNumber, tabName) {
    await I.amOnPage(config.url.manageCase + '/cases/case-details/' + caseNumber);
    if (['preview'].includes(config.runningEnv)) {
      await I.wait(5);
    } else if (['aat', 'demo'].includes(config.runningEnv)) {
      await I.refreshPage();
      await I.wait(15);
    } else {
      await I.wait(3);
    }
    await I.waitForSelector(this.fields.signOutLink, 30);
    await I.clickTab(tabName);
    await I.waitForText(tabName, 15, this.fields.selectedTab);
  },
};
