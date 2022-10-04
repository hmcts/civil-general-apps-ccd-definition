const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'ccd-read-fixed-list-field span',
    links: '.collection-field-table ccd-read-document-field a'
  },

  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 15);
    I.seeInCurrentUrl('Documents');
    I.see(uploadedDoc);
    I.see(expectedLabel);
    I.seeNumberOfVisibleElements(this.fields.links, 3);
  },

  async verifyUploadedDocumentPDF(documentType, childCaseNumber) {
    await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 15);
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
