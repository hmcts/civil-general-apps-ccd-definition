const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    pbaNumber: {
      id: '#generalAppPBADetails_applicantsPbaAccounts',
    },
  },

  async verifyApplicationFee(consentCheck, notice) {
    I.waitForElement(this.fields.pbaNumber.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    I.see('Pay for application with PBA');
    I.see('Application fee to pay');
    if ('no' === consentCheck && 'yes' === notice) {
      I.see('£275');
    } else {
      I.see('£108');
    }
    await I.clickContinue();
  },
};

