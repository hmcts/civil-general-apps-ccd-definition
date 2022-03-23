const {I} = inject();

module.exports = {

  fields: {
    respondentAgreementHasAgreed: {
      id: '#generalAppRespondentAgreement_hasAgreed',
      options: {
        yes: 'Yes',
        no: 'No'
      }
    },
  },

  async selectConsentCheck(consentCheck) {
    await I.waitForElement(this.fields.respondentAgreementHasAgreed.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGARespondentAgreementPage');
    await within(this.fields.respondentAgreementHasAgreed.id, () => {
      I.click(this.fields.respondentAgreementHasAgreed.options[consentCheck]);
    });
    await I.clickContinue();
  }
};

