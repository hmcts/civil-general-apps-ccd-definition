const {I} = inject();

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  async verifyRespSummaryPage() {
    I.seeInCurrentUrl('RESPOND_TO_APPLICATION/confirm');
    I.seeTextEquals('You have responded to an application', '#confirmation-header h1');
  },

  async verifyRespApplicationType() {
 /*   I.waitForElement(this.fields.confirmation.id);
    appTypes.forEach(type => {
      return I.see(type);
    });
    I.wait(2);*/
  }
};

