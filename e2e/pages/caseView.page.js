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
  },
  goButton: 'Go',

  start: function (event) {
    I.selectOption(this.fields.eventDropdown, event);
    I.click(this.goButton);
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
    I.waitInUrl('cases/case-details/', 2);
    I.see(tabName);
    I.click(tabName, 'div.mat-tab-labels');
  }
};
