const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a'
  },

  async verifyUploadedDocument(childCaseNumber, documentType) {
    await I.seeInCurrentUrl('documents');
    await I.seeNumberOfVisibleElements('ccd-read-complex-field-collection-table .complex-panel .complex-panel-title', 2);
    switch (documentType) {
      case 'General order document':
      case 'Directions order document':
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 3);
        break;
      case 'Dismissal order document':
        I.seeNumberOfVisibleElements(this.fields.links, 2);
        break;
    }
    I.see('System generated Case Documents');
    let docURL = await I.grabTextFrom(locate(this.fields.links).last());
    expect(docURL).to.contains(childCaseNumber + '.pdf');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    let docType = await I.grabTextFrom(locate(this.fields.docLabel).last());
    expect(docType).to.equals(documentType);
  }
};
