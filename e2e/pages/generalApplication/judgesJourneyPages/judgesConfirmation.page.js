const {I} = inject();

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  async verifyJudgesConfirmationPage() {
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/confirm');
    I.seeTextEquals('Your order has been made', '#confirmation-header h1');
  },

  async verifyReqMoreInfoConfirmationPage() {
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/confirm');
    I.seeTextEquals('You have requested more information', '#confirmation-header h1');
    await I.see('The applicant will be notified.');
  },

  async closeAndReturnToCaseDetails(childCaseId) {
    await I.see(childCaseId);
    await I.click('Close and Return to case details');
    await I.waitForInvisible(locate('.loading-spinner-in-action').withText('Loading'));
    await I.see(`Case ${childCaseId} has been updated with event: Make decision`);
  }
};

