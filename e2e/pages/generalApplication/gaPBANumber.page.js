const {I} = inject();

module.exports = {

  fields: {
    pbaNumber: {
      id: '#generalAppPBADetails_generalAppPBADetails',
    },
  },

  async verifyApplicationFee(consentCheck, notice) {
    I.waitForElement(this.fields.pbaNumber.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    I.see('Paying for an application');
    I.see('You will be able to pay for your application once it has been submitted.');
    I.see('Application fee to pay');
    if ('no' === consentCheck && 'yes' === notice) {
      I.see('£275');
    } else {
      I.see('£108');
    }
    await I.clickContinue();
  },
};

