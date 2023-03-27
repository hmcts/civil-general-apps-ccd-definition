const {I} = inject();

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  // Todo
  async verifyConfirmationPage() {
    I.seeInCurrentUrl('');
    I.seeTextEquals('Your order has been issued', '#confirmation-header h1');
  },

  async closeAndReturnToCaseDetails() {
    await I.click('Close and Return to case details');
  }
};

