// const events = require('../../../fixtures/ga-ccd/events');
const {I} = inject();

module.exports = {

  fields: {
    summaryTab: 'div.mat-tab-label-content',
    nextStep: '#next-step option'
  },

  async verifySummaryPageAfterResponding() {
    I.seeInCurrentUrl('cases/case-details/');
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

