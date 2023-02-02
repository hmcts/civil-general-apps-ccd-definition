const {I} = inject();

module.exports = {

  fields: {
    checkAnswerForm: {
      classname: '.check-your-answers',
    }
  },

  async verifyCheckAnswerForm(caseId, consentCheck) {
    I.seeInCurrentUrl('/INITIATE_GENERAL_APPLICATION/submit');
    I.see('Check your answers');
    I.seeInCurrentUrl(caseId);
    I.seeNumberOfVisibleElements('.button', 2);
    if ('yes' === consentCheck) {
      I.seeNumberOfVisibleElements('.case-field-change a', 7);
    } else if ('no' === consentCheck) {
      I.seeNumberOfVisibleElements('.case-field-change a', 9);
      I.seeTextEquals('examplePDF.pdf', '.collection-field-table a');
    } else {
      I.seeNumberOfVisibleElements('.case-field-change a', 11);
      I.seeTextEquals('examplePDF.pdf', '.collection-field-table a');
    }
  },

  async clickOnChangeLink(consentCheck) {
    if ('yes' === consentCheck) {
      I.click({css: '.check-your-answers tr:nth-child(6) a'});
    } else {
      I.click({css: '.check-your-answers tr:nth-child(8) a'});
    }
    I.seeInCurrentUrl('/INITIATE_GENERAL_APPLICATIONHearingDetails');
  },
};


