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
    tab: 'div.mat-tab-label-content',
    spinner: 'div.spinner-container',
    caseHeader: 'ccd-case-header > h1',
    generalApps: 'h1.govuk-heading-l',
  },
  goButton: 'Go',

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
    await I.retryUntilExists(async () => {
      await I.navigateToCaseDetails(caseId);
      await this.start(event);
    }, locate('.govuk-heading-l'));
  },

  async assertNoEventsAvailable() {
    if (await I.hasSelector(this.fields.eventDropdown)) {
      throw new Error('Expected to have no events available');
    }
  },

  async navigateToTab(caseNumber, tabName) {
    if (tabName !== 'Application Documents') {
      await I.retryUntilExists(async () => {
        const normalizedCaseId = caseNumber.toString().replace(/\D/g, '');
        console.log(`Navigating to case: ${normalizedCaseId}`);
        await I.amOnPage(`${config.url.manageCase}/cases/case-details/${normalizedCaseId}`);
        if(['preview'].includes(config.runningEnv)) {
          await I.wait(10);
        } else {
          await I.wait(3);
        }
      }, 'exui-header');
    }

    let urlBefore = await I.grabCurrentUrl();

    await I.retryUntilUrlChanges(async () => {
      await I.click(locate(this.fields.tab).withText(tabName));
        if (tabName === 'Application Documents') {
          await I.refreshPage();
          await I.wait(5);
        }
      if(['preview'].includes(config.runningEnv)) {
        await I.wait(5);
      } else {
        await I.wait(3);
      }
      await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
    }, urlBefore);
  },

  async clickOnTab(tabName) {
    let urlBefore = await I.grabCurrentUrl();
    await I.retryUntilUrlChanges(async () => {
      await I.click(locate(this.fields.tab).withText(tabName));
      await I.wait(10);
      await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
    }, urlBefore);
  },

  async clickOnFirstChildCaseId() {
    I.click({css: '.collection-field-table a'});
  }
};
