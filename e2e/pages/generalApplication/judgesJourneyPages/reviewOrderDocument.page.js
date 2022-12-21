const {expect} = require('chai');
const {docFullDate} = require('../../generalAppCommons');
const {I} = inject();

module.exports = {

  fields: {
    previewDocFields: {
      caseForm: '#caseEditForm',
      caseFieldLabel: '.case-field .case-field__label',
      documentLink: '.case-field__value a[href]'
    }
  },

  async reviewOrderDocument(documentType) {
    await I.waitForElement(this.fields.previewDocFields.caseForm);
    await I.seeInCurrentUrl('MAKE_DECISION/MAKE_DECISIONGAJudicial');
    I.seeNumberOfVisibleElements('.button', 2);
    let docURL = await I.grabTextFrom(locate(this.fields.previewDocFields.documentLink));
    expect(docURL).to.contains(`${documentType}_for_application_${docFullDate}`);
    await I.seeTextEquals('Draft Order', this.fields.previewDocFields.caseFieldLabel);
    await I.clickContinue();
  }
};


