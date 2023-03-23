const {expect} = require('chai');
const date = require('../../../fragments/date');
const {selectCourtsOrderType} = require('../../generalAppCommons');
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
      courtInitiativeOrderText: 'textarea[id*="onInitiativeSelectionTextArea"]',
      courWithoutNoticeOrderText: 'textarea[id*="withoutNoticeSelectionTextArea"]',
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

    switch (order) {
      case 'courtOwnInitiativeOrder':
        await selectCourtsOrderType((await I.grabValueFrom(this.fields.courtsOrder.courtInitiativeOrderText)).trim(), order);
        await date.verifyPrePopulatedDate(this.fields.courtsOrder.onInitiativeSelectionDateId);
        break;
      case 'withoutNoticeOrder':
        await selectCourtsOrderType((await I.grabValueFrom(this.fields.courtsOrder.courWithoutNoticeOrderText)).trim(), order);
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

