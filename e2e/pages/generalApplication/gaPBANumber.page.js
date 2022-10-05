const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    pbaNumber: {
      id: '#generalAppPBADetails_applicantsPbaAccounts',
      options: {
        activeAccount2: 'PBA0088192',
        activeAccount1: 'PBA0078095',
        activeAccount3: 'PBA0079005',
      }
    },
    pbaReference: '#generalAppPBADetails_pbaReference',
    errorMessage: '.error-message',
  },

  async selectPbaNumber(pbaNumber) {
    I.waitForElement(this.fields.pbaNumber.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    I.see('Pay for application with PBA');
    I.selectOption(this.fields.pbaNumber.id, this.fields.pbaNumber.options[pbaNumber]);
    await I.click('Continue');
    let pbaErrorMessage = await I.grabTextFrom(this.fields.errorMessage);
    expect(pbaErrorMessage).to.equals('Enter a reference for your PBA account statements is required');
    await I.fillField(this.fields.pbaReference, 'Test PBA reference number');
    await I.clickContinue();
  },

  async verifyApplicationFee(consentCheck, notice) {
    I.waitForElement(this.fields.pbaNumber.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    if ('no' === consentCheck && 'yes' === notice) {
      I.see('£275');
    } else {
      I.see('£108');
    }
  },
};

