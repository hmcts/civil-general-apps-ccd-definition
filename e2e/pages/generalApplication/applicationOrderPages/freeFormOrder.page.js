const {expect} = require('chai');
const date = require('../../../fragments/date');
const {I} = inject();

module.exports = {

  fields: {
    insertRecitals: '#freeFormRecitalText',
    insertRecordedText: '#freeFormRecordedText',
    courtsOrder: {
      id: '#orderOnCourtsList',
      options: {
        courtOwnInitiativeOrder: 'Order on court\'s own initiative',
        withoutNoticeOrder: 'Order without notice',
        noneOrder: 'None',
      },
      onInitiativeSelectionDateId: 'onInitiativeSelectionDate',
      withoutNoticeSelectionDateId: 'withoutNoticeSelectionDate',
    },
  },

  async fillFreeFormOrder(order) {
    await I.waitInUrl('/GENERATE_DIRECTIONS_ORDER/GENERATE_DIRECTIONS_ORDERFreeFormOrder', 5);
    await I.see('Test Inc v Sir John Doe');
    await I.see('Recitals and order');
    await I.fillField(this.fields.insertRecitals, 'Test Recitals');
    await I.fillField(this.fields.insertRecordedText, 'Test Records');
    await I.see('It is ordered that:');
    let orderDetails = await I.grabValueFrom('#freeFormOrderedText');
    await expect(orderDetails).to.equals('Test Order details');
    I.waitForElement(this.fields.courtsOrder.id);
    await within(this.fields.courtsOrder.id, () => {
      I.click(this.fields.courtsOrder.options[order]);
    });
    switch (order) {
      case 'courtOwnInitiativeOrder':
        await I.seeTextEquals('Order on court\'s own initiative', '#onInitiativeSelectionLabel h3');
        await date.verifyPrePopulatedDate(this.fields.courtsOrder.onInitiativeSelectionDateId);
        break;
      case 'withoutNoticeOrder':
        await I.seeTextEquals('Order without notice', '#withoutNoticeSelectionLabel h3');
        await date.verifyPrePopulatedDate(this.fields.courtsOrder.withoutNoticeSelectionDateId);
        break;
    }
    await I.clickContinue();
  },

  async verifyFreeFromErrorMessage() {
    await I.waitInUrl('/GENERATE_DIRECTIONS_ORDER/GENERATE_DIRECTIONS_ORDERFreeFormOrder', 5);
    await I.click('Continue');
    await I.seeNumberOfVisibleElements('.error-message', 2);
  }
};

