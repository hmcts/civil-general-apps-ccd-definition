const {I} = inject();

module.exports = {

  fields: {
    pbaNumber: {
      id: '#generalAppPBADetails_applicantsPbaAccounts',
    },
  },

  async verifyApplicationFee(consentCheck, notice, type) {
    let appType = type.toString();
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGAPBADetailsGAspec');
    I.see('Paying for an application');
    I.see('You will be able to pay for your application once it has been submitted.');
    I.see('Application fee to pay');
    if (('no' === consentCheck && 'yes' === notice) && ('Vary judgment' !== appType || 'Vary order' !== appType)) {
      I.see('£275.00');
    } else if ('Vary judgment' === appType || 'Vary order' === appType) {
      I.see('£14.00');
    } else {
      I.see('£108.00');
    }
    await I.clickContinue();
  },
};

