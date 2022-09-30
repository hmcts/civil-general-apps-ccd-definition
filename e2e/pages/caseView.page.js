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
  },
  goButton: 'Go',

  start: function (event) {
    switch (event) {
      case 'Make decision':
      case 'Make an application':
        I.selectOption(this.fields.eventDropdown, event);
        I.waitForClickable('.event-trigger .button', 10);
        I.click(this.goButton);
        break;
      default:
        I.waitForClickable('.event-trigger .button', 10);
        I.click(this.goButton);
    }
  },

  async startEvent(event, caseId) {
    let urlBefore = await I.grabCurrentUrl();
    await I.retryUntilUrlChanges(async () => {
      await I.navigateToCaseDetails(caseId);
      this.start(event);
    }, urlBefore);
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
