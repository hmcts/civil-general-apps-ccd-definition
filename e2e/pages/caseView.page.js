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
  },
  goButton: 'Go',

  start: function (event) {
    if (event === 'Make decision') {
      I.waitForClickable('.event-trigger .button', 3);
      I.click(this.goButton);
    } else {
      I.selectOption(this.fields.eventDropdown, event);
      I.click(this.goButton);
    }
    I.waitForElement(EVENT_TRIGGER_LOCATOR);
  },

  async startEvent(event, caseId) {
    // await waitForFinishedBusinessProcess(caseId);
    await I.retryUntilExists(async() => {
      await I.navigateToCaseDetails(caseId);
      this.start(event);
    }, locate('h1.govuk-heading-l'));
  },

  async assertNoEventsAvailable() {
    if (await I.hasSelector(this.fields.eventDropdown)) {
      throw new Error('Expected to have no events available');
    }
  },

  async clickOnTab(tabName) {
    await I.waitInUrl('cases/case-details/', 2);
    await I.see(tabName);
    await I.click(tabName, this.fields.tab);
    await I.wait(2);
    await I.click('Summary', this.fields.tab);
    await I.wait(2);
    await I.click(tabName, this.fields.tab);
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
