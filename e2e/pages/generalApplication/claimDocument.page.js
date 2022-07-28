const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a'
  },

  async verifyUploadedDocument(childCaseNumber, documentType) {
    await I.seeInCurrentUrl('documents');
    switch (documentType) {
      case 'General order document':
      case 'Direction order document':
        await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 3);
        I.see('Upload documents');
        I.seeNumberOfVisibleElements(this.fields.links, 3);
        break;
      case 'Dismissal order document':
        await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 2);
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
