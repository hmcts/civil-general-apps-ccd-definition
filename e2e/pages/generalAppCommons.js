const apiRequest = require('../api/apiRequest');
const config = require('../config');
const expect = require('chai').expect;
const {I} = inject();
const dateFrag = require('../fragments/date');

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
const twoDigitDate = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
const ownInitiativeOrder = 'Order on court\'s own initiative';
const withOutNoticeOrder = 'Order without notice';
const noneOrder = 'None';
const initiativeOrderText = 'As this order was made on the court\'s own initiative any party affected ' +
  'by the order may apply to set aside, vary or stay the order. Any such application must be made by 4pm on';
const withOutNoticeOrderText = 'If you were not notified of the application before this order was made, ' +
  'you may apply to set aside, vary or stay the order. Any such application must be made by 4pm on';

let fullDate = date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear().toString();
let docMonth = ((date.getMonth() + 1) >= 10) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
let docFullDate = date.getFullYear().toString() + '-' + docMonth + '-' + twoDigitDate;

module.exports = {

  async selectCourtsOrderType(actualOrderText, orderType, dateId) {
    let expectedOrderText;
    switch (orderType) {
      case 'courtOwnInitiativeOrder':
        await I.click(ownInitiativeOrder);
        await I.waitForText('Please enter date', 3);
        await I.see(ownInitiativeOrder);
        expectedOrderText = initiativeOrderText.replace(/\//g, '').toString();
        await expect(actualOrderText).to.equals(expectedOrderText);
        if (dateId !== undefined) {
          await dateFrag.enterDate(dateId, +1);
        }
        break;
      case 'withoutNoticeOrder':
        await I.click(withOutNoticeOrder);
        await I.waitForText('Please enter date', 3);
        await I.see(withOutNoticeOrder);
        expectedOrderText = withOutNoticeOrderText.replace(/\//g, '').toString();
        await expect(actualOrderText).to.equals(expectedOrderText);
        if (dateId !== undefined) {
          await dateFrag.enterDate(dateId, +1);
        }
        break;
      case 'noneOrder':
        await I.click(noneOrder);
        break;
    }
  },

  verifyJudgeRecitalText: async (actualJudgeRecitalText, notice) => {
    let fullJudgeName;
    if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      fullJudgeName = await apiRequest.getUserFullName(config.judgeUser);
    } else {
      fullJudgeName = await apiRequest.getUserFullName(config.judgeLocalUser);
    }
    if (notice === 'no') {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the without notice application of Claimant dated ${fullDate} \n\nAnd the Judge considered the information provided by the Claimant`);
    } else {
      await expect(actualJudgeRecitalText).to.equals(`Judge: ${fullJudgeName} \n\nThe Judge considered the application of Claimant dated ${fullDate} \n\nAnd the Judge considered the information provided by the parties`);
    }
  },
  docFullDate,
};
