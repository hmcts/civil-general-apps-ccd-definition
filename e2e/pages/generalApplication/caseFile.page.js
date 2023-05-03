const {I} = inject();
const expect = require('chai').expect;
const {docFullDate} = require('../generalAppCommons');

module.exports = {

  fields: {
    docNodes: 'div[aria-label*="Applications"] .node__count',
    docFolder: '[aria-expanded="true"] .node-name-document',
  },

  async verifyCaseFileDocument(documentType) {
    await I.seeInCurrentUrl('File');
    await I.wait(3);
    let docCount = await I.grabTextFrom(locate(this.fields.docNodes));
    expect(docCount).to.equals('1');
    await I.click(this.fields.docNodes);
    let docURL = await I.grabTextFrom(locate(this.fields.docFolder));
    switch (documentType) {
      case 'General order document':
        expect(docURL).to.contains(`General_order_for_application_${docFullDate}`);
        break;
      case 'Directions order document':
        expect(docURL).to.contains(`Directions_order_for_application_${docFullDate}`);
        break;
      case 'Dismissal order document':
        expect(docURL).to.contains(`Dismissal_order_for_application_${docFullDate}`);
        break;
      case 'Hearing Notice':
        expect(docURL).to.contains(`Application_Hearing_Notice_${docFullDate}`);
        break;
    }
  }
};
