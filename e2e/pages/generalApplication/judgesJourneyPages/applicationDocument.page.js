const {docFullDate} = require('../../generalAppCommons');
const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    docLabel: 'ccd-read-fixed-list-field span',
    links: '.collection-field-table ccd-read-document-field a',
    appDocTable: '.Application.Documents',
    tab: 'div.mat-tab-label-content',
  },

  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    await I.waitForElement(this.fields.appDocTable);
    I.seeInCurrentUrl('Documents');
    I.see(uploadedDoc);
    I.see(expectedLabel);
    //  Concurrent written representations journey is now without notice to with notice hence added this logic
    if (expectedLabel !== 'Written representation concurrent document') {
      I.seeNumberOfVisibleElements(this.fields.links, 3);
    } else {
      I.seeNumberOfVisibleElements(this.fields.links, 4);
    }
  },

  async verifyUploadedDocumentPDF(documentType) {
    await I.waitForElement(this.fields.appDocTable);
    await I.seeInCurrentUrl('Documents');
    //  Concurrent written representations journey is now without notice to with notice hence added this logic
    if (documentType === 'Written representation concurrent') {
      await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 2);
    } else {
      await I.seeNumberOfVisibleElements('dl.complex-panel-title span', 1);
    }
    let docURL = await I.grabTextFrom(locate(this.fields.links).first());
    switch (documentType) {
      case 'General order':
        expect(docURL).to.contains(`General_order_for_application_${docFullDate}`);
        break;
      case 'Directions order':
        expect(docURL).to.contains(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order':
        expect(docURL).to.contains(`Dismissal_order_for_application_${docFullDate}`);
        break;
      case 'Request for information':
        expect(docURL).to.contains(`Request_for_information_for_application_${docFullDate}`);
        break;
      case 'Hearing order':
        expect(docURL).to.contains(`Hearing_order_for_application_${docFullDate}`);
        break;
      case 'Written representation sequential':
        expect(docURL).to.contains(`Order_Written_Representation_Sequential_for_application_${docFullDate}`);
        break;
      case 'Written representation concurrent':
        await I.see(`Order_Written_Representation_Concurrent_for_application_${docFullDate}`);
        break;
    }
    await I.see('Type');
    await I.see('Uploaded on');
    await I.see('Document URL');
    //  Concurrent written representations journey is now without notice to with notice hence added this logic
    if (documentType === 'Written representation concurrent') {
      await I.seeTextEquals('Request for information', locate(this.fields.docLabel).first());
      await I.seeTextEquals(documentType, locate(this.fields.docLabel).last());
    } else {
      await I.seeTextEquals(documentType, this.fields.docLabel);
    }
  }
};
