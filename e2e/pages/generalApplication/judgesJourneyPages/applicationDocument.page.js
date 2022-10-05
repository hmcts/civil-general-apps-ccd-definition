const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'ccd-read-fixed-list-field span',
    links: '.collection-field-table ccd-read-document-field a',
    appDocTable:'.Application.Documents',
    tab: 'div.mat-tab-label-content',
  },

  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    await I.waitForElement(this.fields.appDocTable);
    I.seeInCurrentUrl('Documents');
    I.see(uploadedDoc);
    I.see(expectedLabel);
    I.seeNumberOfVisibleElements(this.fields.links, 3);
  },

  async verifyUploadedDocumentPDF(documentType, childCaseNumber) {
    await I.waitForElement(this.fields.appDocTable);
    await I.seeInCurrentUrl('Documents');
    await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 1);
    let docURL = await I.grabTextFrom(locate(this.fields.links).first());
    expect(docURL).to.contains(childCaseNumber + '.pdf');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    await I.seeTextEquals(documentType, this.fields.docLabel);
  }
};
