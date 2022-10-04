// const events = require('../../../fixtures/ga-ccd/events');
const {I} = inject();

module.exports = {

  fields: {
    summaryTab: 'div.mat-tab-label-content',
    nextStep: '#next-step option',
    tab: 'div.mat-tab-label-content',
  },

  async verifySummaryPageAfterResponding() {
    I.seeInCurrentUrl('cases/case-details/');
    let urlBefore = await I.grabCurrentUrl();
    await I.retryUntilUrlChanges(() => I.click(locate(this.fields.tab).withText('Summary')), urlBefore);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
    I.wait(1);
    I.see('Summary');
    I.see('Parent Case ID');
    I.see('Hearing details');
    I.see('Preferred location');
    // I.dontSee(events.RESPOND_TO_APPLICATION.name);
    I.seeTextEquals('examplePDF.pdf', '.Summary ccd-read-document-field > a');
    I.seeNumberOfVisibleElements('.Summary a', 2);
    I.see('Respondent hearing details');
    I.see('Vulnerability questions');
  }
};

