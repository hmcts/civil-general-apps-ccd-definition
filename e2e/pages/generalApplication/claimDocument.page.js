const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a'
  },

  async verifyUploadedDocument(documentType) {
    await I.seeInCurrentUrl('documents');
    await I.seeNumberOfVisibleElements('ccd-read-complex-field-collection-table .complex-panel .complex-panel-title', 2);
    let docURL = await I.grabTextFrom(locate(this.fields.links).last());
    switch (documentType) {
      case 'General order document':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 3);
        expect(docURL).to.contains(`General_order_for_application_${docFullDate}`);
        break;
      case 'Directions order document':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 3);
        expect(docURL).to.contains(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order document':
        I.seeNumberOfVisibleElements(this.fields.links, 2);
        expect(docURL).to.contains(`Dismissal_order_for_application_${docFullDate}`);
        break;
      case 'Hearing Notice':
        expect(docURL).to.contains(`Application_Hearing_Notice_${docFullDate}`);
        break;
    }
    I.see('System generated Case Documents');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    let docType = await I.grabTextFrom(locate(this.fields.docLabel).last());
    expect(docType).to.equals(documentType);
  }
};
