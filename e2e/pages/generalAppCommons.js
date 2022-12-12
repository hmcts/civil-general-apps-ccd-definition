const apiRequest = require('../api/apiRequest');
const config = require('../config');
const expect = require('chai').expect;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
let fullDate = twoDigitDate + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString().substr(-2);
let expectedRecitalForWithoutNotice = `Upon the application of Claimant dated ${fullDate} and upon considering the information provided by the Claimant`;
let expectedRecitalForWithNotice = `Upon the application of Claimant dated ${fullDate} and upon considering the information provided by the parties`;

module.exports = {
  verifyJudgeRecitalText: async (actualJudgeRecitalText, consentCheck) => {
    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await expect(actualJudgeRecitalText).to.contains(apiRequest.getUserFullName(config.judgeUser));
    } else {
      await expect(actualJudgeRecitalText).to.contains(apiRequest.getUserFullName(config.judgeLocalUser));
    }
    if (consentCheck === 'no') {
      await expect(actualJudgeRecitalText).to.contains(expectedRecitalForWithoutNotice);
    } else {
      await expect(actualJudgeRecitalText).to.contains(expectedRecitalForWithNotice);
    }
  }
};
