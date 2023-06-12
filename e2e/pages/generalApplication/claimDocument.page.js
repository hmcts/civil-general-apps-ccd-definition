const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a',
    docTitles: 'ccd-read-complex-field-collection-table .complex-panel .complex-panel-title'
  },

  async verifyHearingNoticeDocNotAvailable() {
    await I.dontSee('Hearing Notice', locate(this.fields.docLabel).last());
  },

  async verifyUploadedDocument(documentType) {
    await I.seeInCurrentUrl('documents');
    if (documentType === 'After SDO - Hearing Notice') {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 5);
    } else if (documentType === 'Free From Order' || documentType === 'Assisted Order') {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 4);
    } else {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 3);
    }
    let draftAppURL = await I.grabTextFrom(locate(this.fields.links).last());
    expect(draftAppURL).to.contains(`Draft_application_${docFullDate}`);

    switch (documentType) {
      case 'General order document':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 4);
        I.see(`General_order_for_application_${docFullDate}`);
        break;
      case 'Free From Order':
      case 'Assisted Order':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 5);
        I.see(`General_order_for_application_${docFullDate}`);
        I.see(`Application_Hearing_Notice_${docFullDate}`);
        break;
      case 'Directions order document':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 4);
        I.see(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order document':
        I.seeNumberOfVisibleElements(this.fields.links, 3);
        I.see(`Dismissal_order_for_application_${docFullDate}`);
        break;
      case 'Hearing Notice':
        I.see(`Application_Hearing_Notice_${docFullDate}`);
        break;
      case 'Consent order document':
        await I.see(`Consent_order_for_application_${docFullDate}`);
        break;
    }
    I.see('System generated Case Documents');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    let docType = await I.grabTextFrom(locate(this.fields.docLabel).last());
    if (documentType === 'After SDO - Hearing Notice') {
      expect(docType).to.equals('Hearing Notice');
    } else if (documentType === 'Free From Order' || documentType === 'Assisted Order') {
      await I.seeTextEquals('General order document', locate(this.fields.docLabel).at(3));
      await I.seeTextEquals('Hearing Notice', locate(this.fields.docLabel).at(4));
      await I.seeTextEquals('Draft Application', locate(this.fields.docLabel).last());
    } else {
      expect(docType).to.equals('Draft Application');
    }
  }
};
