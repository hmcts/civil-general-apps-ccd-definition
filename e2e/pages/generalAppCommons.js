const apiRequest = require('../api/apiRequest');
const config = require('../config');
const expect = require('chai').expect;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
let fullDate = twoDigitDate + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString().substr(-2);

module.exports = {
  verifyJudgeRecitalText: async (actualJudgeRecitalText, consentCheck) => {
    let fullJudgeName = await apiRequest.getUserFullName(config.judgeUser);
    if (consentCheck === 'yes') {
      await expect(actualJudgeRecitalText).to.equals(`${fullJudgeName} \nUpon the application of Claimant dated ${fullDate} and upon considering the information provided by the Claimant`);
    } else {
      await expect(actualJudgeRecitalText).to.equals(`${fullJudgeName} \nUpon the application of Claimant dated ${fullDate} and upon considering the information provided by the parties`);
    }
  }
};
