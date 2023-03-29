const {I} = inject();

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  async verifyConfirmationPage() {
    await I.waitInUrl('GENERATE_DIRECTIONS_ORDER/confirm');
    I.see('The order has been sent to:');
    I.see('Test Inc');
    I.see('Sir John Doe');
  },

  async closeAndReturnToCaseDetails() {
    await I.click('Close and Return to case details');
  }
};

