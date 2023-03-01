const {I} = inject();

module.exports = {

  fields: {
    pbaNumber: {
      id: '#pbaAccountNumber',
      options: {
        activeAccount1: 'PBA0088192',
        activeAccount2: 'PBA0078095'
      }
    },
    reviewLinks: '.govuk-table__body td a',
    serviceRequestTable: '.ServiceRequestTab a',
  },

  async verifyPaymentDetails(childCaseNumber) {
    I.waitInUrl(childCaseNumber);
    I.seeNumberOfVisibleElements(this.fields.reviewLinks, 1);
    I.click(this.fields.reviewLinks);
    I.see('Paid');
    I.see('General application');
    I.see('Total fees to pay');
  },

  async payGAAmount(childCaseNumber) {
    I.waitInUrl(childCaseNumber);
    await I.waitForClickable(this.fields.serviceRequestTable, 10);
    await I.see('Not paid');
    I.click('Pay now');
    I.click({css: 'input#pbaAccount'});
    I.waitForElement(this.fields.pbaNumber.id);
    I.selectOption(this.fields.pbaNumber.id, this.fields.pbaNumber.options['activeAccount1']);
    I.fillField('pbaAccountRef', 'Test Test');
    I.click({css: 'div.govuk-form-group span'});
    I.click('Confirm payment');
    await I.waitForText('Payment successful');
    I.wait(5);
    I.click('View service requests');
  }
};
