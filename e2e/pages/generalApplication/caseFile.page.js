const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    appFolder: 'div[aria-label*="Applications"] .node__count',
    orderFolder: 'div[aria-label*="Orders"] .node__count',
    ordersFolder: '[aria-expanded="true"] .node-name-document',
  },

  async verifyCaseFileDocument(documentType) {
    await I.seeInCurrentUrl('File');
    await I.wait(3);

    if (documentType === 'Hearing Notice') {
      let docCount = await I.grabTextFrom(locate(this.fields.appFolder));
      expect(docCount).to.equals('1');
      await I.click(this.fields.appFolder);
    }
    await I.click(locate(this.fields.orderFolder).first());
    await I.waitForText('Orders made on applications');
    await I.click('Orders made on applications');
    let docs = await I.grabTextFromAll(locate(this.fields.ordersFolder));
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
      case 'Hearing Notice':
        expect(docs.toString()).to.includes(`Application_Hearing_Notice_${docFullDate}`,
          `General_order_for_application_${docFullDate}`,);
        break;
      case 'Consent Order':
        expect(docs.toString()).to.contains(`Consent_order_for_application_${docFullDate}`);
        break;
    }
  }
};
