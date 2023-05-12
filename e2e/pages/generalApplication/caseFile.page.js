const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    appFolder: 'div[aria-label*="Applications"] .node__count',
    orderFolder: 'div[aria-label*="Orders"] .node__count',
    expandedFolder: '[aria-expanded="true"] .node-name-document',
    nameFolder: 'div[aria-label*="Applications"] + span',
  },

  async verifyCaseFileAppDocument(documentType) {
    await I.seeInCurrentUrl('File');
    await I.waitNumberOfVisibleElements('.cdk-tree', 1, 20);
    await I.waitForText('Applications', 20, this.fields.nameFolder);
    await I.click(locate(this.fields.appFolder));
    let docs = await I.grabTextFromAll(locate(this.fields.expandedFolder));
    switch (documentType) {
      case 'Hearing Notice':
        expect(docs.toString()).to.includes(`Application_Hearing_Notice_${docFullDate}`,
          `Hearing_order_for_application_${docFullDate}`,);
        break;
      case 'Applicant Evidence':
        expect(docs.toString()).to.contains('examplePDF.pdf');
        break;
    }
    await I.click(locate(this.fields.appFolder));
  },

  async verifyCaseFileOrderDocument(documentType) {
    await I.seeInCurrentUrl('File');
    await I.waitNumberOfVisibleElements('.cdk-tree', 1, 20);
    await I.waitForText('Applications', 20, this.fields.nameFolder);
    await I.click(locate(this.fields.orderFolder).first());
    await I.waitForText('Orders made on applications');
    await I.click('Orders made on applications');
    let docs = await I.grabTextFromAll(locate(this.fields.expandedFolder));
    switch (documentType) {
      case 'General order document':
        expect(docs.toString()).to.contains(`General_order_for_application_${docFullDate}`);
        break;
      case 'Directions order document':
        expect(docs.toString()).to.contains(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order document':
        expect(docs.toString()).to.contains(`Dismissal_order_for_application_${docFullDate}`);
        break;
    }
    await I.click(locate(this.fields.orderFolder).first());
  }
};
