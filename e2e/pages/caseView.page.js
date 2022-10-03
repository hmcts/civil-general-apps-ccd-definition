const config = require('../config');
const {I} = inject();

module.exports = {

  tabs: {
    summary: 'Summary',
    claimDetails: 'Claim details',
    history: 'History',
    Applications: 'Applications'
  },
  fields: {
    eventDropdown: '#next-step',
    tab: 'div.mat-tab-labels',
    spinner: 'div.spinner-container',
    caseHeader: 'ccd-case-header > h1',
    generalApps: 'h1.govuk-heading-l',
  },
  goButton: 'Go',

  async start(event) {
    switch (event) {
      case 'Make decision':
      case 'Make an application':
        await I.waitForElement(this.fields.eventDropdown, 10);
        await I.selectOption(this.fields.eventDropdown, event);
        await I.retryUntilExists(async () => {
          await I.click(this.goButton);
        }, this.fields.generalApps);
        break;
      default:
        await I.waitForClickable('.event-trigger .button', 10);
        await I.retryUntilExists(async () => {
          await I.click(this.goButton);
        }, this.fields.generalApps);
    }
  },

  async startEvent(event, caseId) {
    let urlBefore = await I.grabCurrentUrl();
    await I.retryUntilUrlChanges(async () => {
      await I.navigateToCaseDetails(caseId);
      await this.start(event);
    }, urlBefore);
  },

  async assertNoEventsAvailable() {
    if (await I.hasSelector(this.fields.eventDropdown)) {
      throw new Error('Expected to have no events available');
    }
  },

  async navigateToTab(caseNumber, tabName) {
    await I.retryUntilExists(async () => {
      const normalizedCaseId = caseNumber.toString().replace(/\D/g, '');
      console.log(`Navigating to tab: ${tabName}`);
      await I.amOnPage(`${config.url.manageCase}/cases/case-details/${normalizedCaseId}#${tabName}`);
      await I.wait(2);
      await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 15);
      await I.waitForElement(this.fields.caseHeader, 15);
    }, this.fields.caseHeader);
  },

  async navigateToAppTab(caseNumber) {
    await I.retryUntilExists(async () => {
      await I.amOnPage(`${config.url.manageCase}/cases/case-details/${caseNumber}#Applications`);
      await I.wait(3);
      await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 20);
      await I.waitForElement(this.fields.caseHeader, 15);
    }, this.fields.caseHeader);
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
