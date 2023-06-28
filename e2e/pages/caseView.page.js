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
  },
  goButton: 'button[type="submit"]',

  async start(event) {
    let urlBefore = await I.grabCurrentUrl();
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
        await I.waitForElement(this.fields.eventDropdown, 10);
        await I.selectOption(this.fields.eventDropdown, event);
        await I.retryUntilUrlChanges(() => I.waitForNavigationToComplete(this.goButton), urlBefore);
        break;
      default:
        await I.waitForClickable('.event-trigger .button', 10);
        await I.retryUntilUrlChanges(() => I.waitForNavigationToComplete(this.goButton), urlBefore);
    }
  },

  async startEvent(event, caseId) {
    await I.navigateToCaseDetails(caseId);
    await this.start(event);
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
    await I.waitForElement(this.fields.tabList, 5);
    await I.refreshPage();
    if (['preview', 'aat', 'demo'].includes(config.runningEnv)) {
      await I.wait(12);
    } else {
      await I.wait(5);
    }
    await I.forceClick(locate(this.fields.tab).withText(tabName));
    await I.waitForText(tabName, 10, this.fields.selectedTab);
  },

  async clickMainTab(tabName) {
    await I.waitForElement(this.fields.tabList, 10);
    await I.forceClick(locate(this.fields.tab).withText(tabName));
    await I.waitForText(tabName, 10, this.fields.selectedTab);
  },

  async navigateToTab(caseNumber, tabName) {
    await I.amOnPage(config.url.manageCase + '/cases/case-details/' + caseNumber);
    if (['preview', 'aat', 'demo'].includes(config.runningEnv)) {
      await I.wait(10);
    } else {
      await I.wait(6);
    }
    await I.clickTab(tabName);
    await I.waitForText(tabName, 15, this.fields.selectedTab);
  },
};
