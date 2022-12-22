const apiRequest = require('../api/apiRequest');
const config = require('../config');
const expect = require('chai').expect;
const {I} = inject();

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
let fullDate = twoDigitDate + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString().substr(-2);
let docMonth = date.getMonth() + 1;
let docFullDate = date.getFullYear().toString() + '-' + docMonth + '-' + twoDigitDate;

module.exports = {

  fields: {
    judicialByCourtsInitiative: 'div[id*="judicialByCourtsInitiative"]',
    judicialByCourtsInitiativeOption1: 'input[id*="OPTION_1"]',
  },

  async selectJudicialByCourtsInitiativeOption() {
    await I.waitForElement(this.fields.judicialByCourtsInitiative);
    await I.click(this.fields.judicialByCourtsInitiativeOption1);
  },

  verifyJudgeRecitalText: async (actualJudgeRecitalText, notice) => {
    let fullJudgeName = await apiRequest.getUserFullName(config.judgeUser);
    if (notice === 'no') {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the without notice application of Claimant dated ${fullDate} \nAnd the Judge considering the information provided by the Claimant`);
    } else {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the application of Claimant dated ${fullDate} \nAnd the Judge considering the information provided by the parties`);
    }
  },
  docFullDate,
};
