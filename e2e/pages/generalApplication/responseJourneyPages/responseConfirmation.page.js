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
    await I.see('')
  },

  async verifyRespApplicationType(appTypes) {
    I.waitForElement(this.fields.confirmation.id);
    appTypes.forEach(type => {
      return I.see(type);
    });
    I.wait(2);
  }
};

