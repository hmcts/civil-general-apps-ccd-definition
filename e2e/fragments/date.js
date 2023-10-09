const {expect} = require('chai');
const {I} = inject();

module.exports = {

  fields: function (id) {
    return {
      day: `#${id}-day`,
      month: `#${id}-month`,
      year: `#${id}-year`,
    };
  },

  async enterDate(fieldId = '', plusDays = 28) {
    I.waitForElement(this.fields(fieldId).day);
    const date = new Date();
    date.setDate(date.getDate() + plusDays);
    I.fillField(this.fields(fieldId).day, date.getDate());
    I.fillField(this.fields(fieldId).month, date.getMonth() + 1);
    I.fillField(this.fields(fieldId).year, date.getFullYear());
  },

  async verifyPrePopulatedDate(fieldId, orderType) {
    I.waitForElement(this.fields(fieldId).day);
    const date = new Date();
    let docMonth = ((date.getMonth() + 1) >= 10) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    let twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());

    let expectedDay = await I.grabValueFrom(this.fields(fieldId).day);

    switch (orderType) {
      case 'freeFromOrder':
        date.setDate(date.getDate() + 7);
        docMonth = ((date.getMonth() + 1) >= 10) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
        await expect(expectedDay).to.equals((twoDigitDate).toString());
        break;
      case 'assistedOrder':
        await expect(expectedDay).to.equals(twoDigitDate.toString());
        break;
    }

    let expectedMonth = await I.grabValueFrom(this.fields(fieldId).month);
    await expect(expectedMonth).to.equals(docMonth.toString());

    let expectedYear = await I.grabValueFrom(this.fields(fieldId).year);
    await expect(expectedYear).to.equals(date.getFullYear().toString());
  },
};
