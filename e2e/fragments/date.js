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

  async verifyPrePopulatedDate(fieldId) {
    I.waitForElement(this.fields(fieldId).day);
    const date = new Date();

    let expectedDay = await I.grabValueFrom(this.fields(fieldId).day);
    await expect(expectedDay).to.equals(date.getDate().toString());

    let expectedMonth = await I.grabValueFrom(this.fields(fieldId).month);
    await expect(expectedMonth).to.equals('0' + (date.getMonth() + 1).toString());

    let expectedYear = await I.grabValueFrom(this.fields(fieldId).year);
    await expect(expectedYear).to.equals(date.getFullYear().toString());
  },
};
