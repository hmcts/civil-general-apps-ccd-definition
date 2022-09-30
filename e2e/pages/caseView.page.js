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
    spinner: 'div.spinner-container',
  },
  goButton: '.event-trigger .button',

  start: function (event) {
    switch (event) {
      case 'Make decision':
      case 'Make an application':
        I.selectOption(this.fields.eventDropdown, event);
        I.waitForClickable(this.goButton, 10);
        I.forceClick(this.goButton);
        break;
      default:
        I.waitForClickable(this.goButton, 10);
        I.forceClick(this.goButton);
    }
    I.waitForElement(EVENT_TRIGGER_LOCATOR, 15);
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

  async navigateToAppTab(caseNumber) {
    await I.amOnPage(`${config.url.manageCase}/cases/case-details/${caseNumber}#Applications`);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 15);
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
