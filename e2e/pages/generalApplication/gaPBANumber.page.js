const {I} = inject();

module.exports = {

  fields: {
    pbaNumber: {
      id: '#generalAppPBADetails_applicantsPbaAccounts',
      options: {
        activeAccount1: 'PBA0088192',
        activeAccount2: 'PBA0078095',
        activeAccount3: 'PBA0079005',
      }
    },
    pbaReference: '#generalAppPBADetails_pbaReference',
  },

  async selectPbaNumber(pbaNumber, consentCheck) {
    I.waitForElement(this.fields.pbaNumber.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    I.see('Pay for application with PBA');
    if ('yes' === consentCheck) {
      I.see('£108');
    } else {
      I.see('£275');
    }
    I.selectOption(this.fields.pbaNumber.id, this.fields.pbaNumber.options[pbaNumber]);
    await I.fillField(this.fields.pbaReference, 'Test PBA reference number');
    await I.clickContinue();
  }
};

