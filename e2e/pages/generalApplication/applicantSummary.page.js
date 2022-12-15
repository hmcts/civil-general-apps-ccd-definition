const events = require('../../fixtures/ga-ccd/events');
const {I} = inject();

module.exports = {

  fields: {
    summaryTab: 'div.mat-tab-label-content',
    nextStep: '#next-step option',
  },

  async verifySummaryPage() {
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 20);
    I.waitInUrl('#Summary');
    I.see('Summary');
    I.see('Parent Case ID');
    I.see('Hearing details');
    I.see('Preferred location');
    I.dontSee(events.RESPOND_TO_APPLICATION.name);
  }
};

