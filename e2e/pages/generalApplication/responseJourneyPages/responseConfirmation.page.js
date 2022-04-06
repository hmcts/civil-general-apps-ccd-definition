const {I} = inject();

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  async verifyRespConfirmationPage() {
    I.seeInCurrentUrl('RESPOND_TO_APPLICATION/confirm');
    I.seeTextEquals('You have provided the requested info', '#confirmation-header h1');
  },

  async verifyRespApplicationType(appTypes) {
    I.waitForElement(this.fields.confirmation.id);
    appTypes.forEach(type => {
      return I.see(type);
    });
    I.wait(2);
  },

  async closeAndReturnToCaseDetails(childCaseId) {
    await I.click('Close and Return to case details');
    await I.waitForInvisible(locate('.loading-spinner-in-action').withText('Loading'));
    await I.see(`Case ${childCaseId} has been updated with event: Respond to application`);
  }
};

