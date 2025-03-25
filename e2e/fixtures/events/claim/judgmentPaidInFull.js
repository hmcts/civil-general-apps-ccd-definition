const {date} = require('../../../api/dataHelper');

module.exports = {
  valid: {
    MarkJudgmentPaidInFull: {
      joJudgmentPaidInFull: {
        dateOfFullPaymentMade:  date,
        confirmFullPaymentMade:['CONFIRMED']
      }
    }
  }
};
