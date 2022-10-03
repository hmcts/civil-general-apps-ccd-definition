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
    const normalizedCaseId = caseNumber.toString().replace(/\D/g, '');
    await I.amOnPage(`${config.url.manageCase}/cases/case-details/${normalizedCaseId}#${tabName}`);
    await I.wait(2);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
    await I.refreshPage();
    await I.wait(10);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
  },

  async navigateToAppTab(caseNumber) {
      await I.amOnPage(`${config.url.manageCase}/cases/case-details/${caseNumber}#Applications`);
      await I.wait(2);
      await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
      await I.refreshPage();
      await I.wait(8);
      await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
