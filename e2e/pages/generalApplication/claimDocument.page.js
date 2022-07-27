const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a'
  },

  async verifyUploadedDocument(childCaseNumber, documentType) {
    await I.seeInCurrentUrl('documents');
    await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 3);
    I.see('System generated Case Documents');
    I.see('Upload documents');
    I.seeNumberOfVisibleElements(this.fields.links, 3);
    let docURL = await I.grabTextFrom(locate(this.fields.links).last());
    expect(docURL).to.contains(childCaseNumber + '.pdf');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    let docType = await I.grabTextFrom(locate(this.fields.docLabel).last());
    expect(docType).to.equals(documentType);
  }
};
