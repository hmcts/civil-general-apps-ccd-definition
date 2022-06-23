const {I} = inject();
const {verifyJudgeRecitalText} = require('../../generalAppCommons');

module.exports = {

  fields: {
    summaryLabels: 'ccd-field-read-label ng-component span',
  },

  async verifyJudgesSummaryPage(decisionType) {
    I.seeInCurrentUrl('cases/case-details/');
    I.see('Summary');
    I.see('Parent Case ID');
    I.see('Hearing details');
    I.see('Preferred location');
    I.see('Vulnerability questions');
    switch (decisionType) {
      case 'Judges Directions':
        await verifyJudgeRecitalText(await I.grabTextFrom(locate(this.fields.summaryLabels).first()));
        await I.see('Reasons for decision');
        await I.see('Directions');
        await I.see('When should this application be referred to a Judge again?');
        break;
      case 'Concurrent representations':
        await I.see('Make an order for written representations');
        await I.see('Concurrent representations');
        await I.see('Directions in relation to hearing');
        break;
      case 'Sequential representations':
        await I.see('Make an order for written representations');
        await I.see('Sequential representations');
        await I.see('Directions in relation to hearing');
        await I.see('The respondent may upload any written representations by 4pm');
        await I.see('The applicant may upload any written representations by 4pm');
        break;
      case 'Request more information':
        await I.see('Enter the information required');
        await I.see('Request for information');
        await I.see('When should this application be referred to a Judge again?');
        break;
      case 'Dismissal order':
        await I.see('Judges dismissed the order');
        await I.see('Dismissal order');
        await I.see('Reasons for decision');
        break;
    }
  }
};

