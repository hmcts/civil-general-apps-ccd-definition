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

  async verifyReqMoreInfoConfirmationPage(infoType) {
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/confirm');
    switch (infoType) {
      case 'requestMoreInformation':
        I.seeTextEquals('You have requested more information', '#confirmation-header h1');
        await I.see('The applicant will be notified.');
        break;
      case 'sendApplicationToOtherParty':
        I.seeTextEquals('You have requested a response', '#confirmation-header h1');
        await I.see('The parties will be notified.');
        break;
    }
  },

  async closeAndReturnToCaseDetails(childCaseId) {
    await I.see(childCaseId);
    await I.click('Close and Return to case details');
    await I.waitForInvisible(locate('.loading-spinner-in-action').withText('Loading'), 5);
    //await I.see(`Case ${childCaseId} has been updated with event: Make decision`);
  }
};
