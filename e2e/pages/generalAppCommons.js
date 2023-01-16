const apiRequest = require('../api/apiRequest');
const config = require('../config');
const expect = require('chai').expect;
const {I} = inject();

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
let fullDate = date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString();
let docMonth = ((date.getMonth()+1) >= 10) ? (date.getMonth()+1) : '0' + (date.getMonth()+1);
let docFullDate = date.getFullYear().toString() + '-' + docMonth + '-' + twoDigitDate;

module.exports = {

  async selectJudicialByCourtsInitiativeOption() {
    await I.waitForElement('div[id*="judicialByCourtsInitiative"]');
    await I.forceClick('input[id*="OPTION_1"]');
  },

  verifyJudgeRecitalText: async (actualJudgeRecitalText, notice) => {
    let fullJudgeName = await apiRequest.getUserFullName(config.judgeUser);
    if (notice === 'no') {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the without notice application of Claimant dated ${fullDate} \nAnd the Judge considered the information provided by the Claimant`);
    } else {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the application of Claimant dated ${fullDate} \nAnd the Judge considered the information provided by the parties`);
    }
  },
  docFullDate,
};
