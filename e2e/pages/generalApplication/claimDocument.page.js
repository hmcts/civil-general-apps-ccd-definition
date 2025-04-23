const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a',
    docTitles: 'ccd-read-complex-field-collection-table .complex-panel .complex-panel-title',
    uploadDocumentsTitle : '#case-viewer-field-read--servedDocumentFiles .complex-panel-title .text-16'
  },

  async verifyHearingNoticeDocNotAvailable() {
    await I.dontSee('Hearing Notice', locate(this.fields.docLabel).last());
  },

  async verifyUploadedDocument(documentType) {
    await I.seeInCurrentUrl('documents');
    if (documentType === 'After SDO - Hearing Notice') {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 5);
    } else if (documentType === 'Free From Order' || documentType === 'Assisted Order') {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 7);
    } /*else {
      await I.seeNumberOfVisibleElements(this.fields.docTitles, 5);
      await I.seeNumberOfVisibleElements(this.fields.uploadDocumentsTitle, 1);
    }*/
    /*let draftAppURL = await I.grabTextFrom(locate(this.fields.links).last());
    expect(draftAppURL).to.contains(`Hearing_order_for_application_${docFullDate}`);*/

    switch (documentType) {
      case 'General order document':
        I.see('Upload documents');
        I.see(`General_order_for_application_${docFullDate}`);
        break;
      case 'Free From Order':
      case 'Assisted Order':
        I.see('Upload documents');
        I.see(`General_order_for_application_${docFullDate}`);
        I.see(`Application_Hearing_Notice_${docFullDate}`);
        break;
      case 'Directions order document':
        I.see('Upload documents');
        I.see(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order document':
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
    //let docType = await I.grabTextFrom(locate(this.fields.docLabel).last());
    if (documentType === 'After SDO - Hearing Notice') {
      await I.seeTextEquals('Hearing Notice', locate(this.fields.docLabel).at(5));
      await I.seeTextEquals('Draft Application document', locate(this.fields.docLabel).last());
    } else if (documentType === 'Free From Order' || documentType === 'Assisted Order') {
      await I.seeTextEquals('General order document', locate(this.fields.docLabel).at(5));
      await I.seeTextEquals('Hearing Notice', locate(this.fields.docLabel).at(6));
      await I.seeTextEquals('Draft Application document', locate(this.fields.docLabel).at(7));
      await I.seeTextEquals('hearing order doc in casefile view', locate(this.fields.docLabel).last());
    } /*else {
      expect(docType).to.equals('Draft Application document') || expect(docType).to.equals('hearing order doc in casefile view');
    }*/
  }
};
