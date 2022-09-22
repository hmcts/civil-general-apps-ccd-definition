const config = require('../config');
const {I} = inject();
const EVENT_TRIGGER_LOCATOR = 'ccd-case-event-trigger';

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
    spinner: '.loading-spinner-in-action',
  },
  goButton: 'Go',

  start: function (event) {
    switch (event) {
      case 'Make decision':
      case 'Make an application':
        I.selectOption(this.fields.eventDropdown, event);
        I.click(this.goButton);
        break;
      default:
        I.waitForClickable('.event-trigger .button', 3);
        I.click(this.goButton);
    }
    I.waitForElement(EVENT_TRIGGER_LOCATOR);
  },

  async startEvent(event, caseId) {
    await I.retryUntilExists(async () => {
      await I.navigateToCaseDetails(caseId);
      this.start(event);
    }, locate('h1.govuk-heading-l'));
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
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'));
    await I.refreshPage();
    await I.wait(5);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'));
  },

  async navigateToAppTab(caseNumber) {
    await I.amOnPage(`${config.url.manageCase}/cases/case-details/${caseNumber}#Applications`);
    await I.wait(5);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'));
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
