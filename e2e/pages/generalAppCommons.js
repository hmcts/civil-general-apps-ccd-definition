const expect = require('chai').expect;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
let fullDate = twoDigitDate + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString().substr(-2);
let expectedJudgeRecitalText = `Upon reading the application of Claimant dated ${fullDate} and upon the application of Test Inc dated ${fullDate} and upon considering the information provided by the parties`;
let expectedHDJudgeRecitalText = `Upon reading the application of Claimant dated ${fullDate} and upon considering the information provided by the parties`;

module.exports = {

  verifyJudgeRecitalText: async actualJudgeRecitalText => {
    await expect(actualJudgeRecitalText).to.equals(expectedJudgeRecitalText);
  },

  verifyHearingDetailsJudgeRecitalText: async actualJudgeRecitalText => {
    await expect(actualJudgeRecitalText).to.equals(expectedHDJudgeRecitalText);
  },
};
