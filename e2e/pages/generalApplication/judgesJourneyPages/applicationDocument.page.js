const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'ccd-read-fixed-list-field span',
    links: '.collection-field-table ccd-read-document-field a',
    spinner: 'div.spinner-container',
  },

  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    await I.waitInUrl('#Documents', 5);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 10);
    I.waitNumberOfVisibleElements(this.fields.links, 3, 5);
    I.see(uploadedDoc);
    I.see(expectedLabel);
    I.seeNumberOfVisibleElements(this.fields.links, 3);
  },

  async verifyUploadedDocumentPDF(documentType, childCaseNumber) {
    await I.waitInUrl('#Documents', 5);
    await I.waitForInvisible(locate(this.fields.spinner).withText('Loading'), 10);
    I.waitNumberOfVisibleElements(this.fields.links, 2, 5);
    await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 1);
    let docURL = await I.grabTextFrom(locate(this.fields.links).first());
    expect(docURL).to.contains(childCaseNumber + '.pdf');
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    await I.seeTextEquals(documentType, this.fields.docLabel);
  }
};
