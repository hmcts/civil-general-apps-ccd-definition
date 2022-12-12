const {I} = inject();
const {verifyJudgeRecitalText} = require('../../generalAppCommons');
const config = require('../../../config');

module.exports = {

  fields: {
    hearingDetailsJudgeRecitalTextArea: '#judicialGeneralHearingOrderRecital',
    hearingDetailsDirectionsTextArea: '#judicialGOHearingDirections',
    writtenRepresentationsJudgeRecitalTextArea: '#judgeRecitalText',
    writtenRepresentationsDirectionsTextArea: '#directionInRelationToHearingText',
  },

  async verifyHearingDetailsGeneralOrderScreen(hearingPreferences, timeEstimate, consentCheck) {
    await I.waitForElement(this.fields.hearingDetailsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialHearingDetailsGeneralOrderScreen');
    if (!config.runWAApiTest) {
      I.see('Draw a General Order');
    }
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.hearingDetailsJudgeRecitalTextArea), consentCheck);
    await I.see(`Hearing type is ${hearingPreferences}`);
    await I.see(`Estimated length of hearing is ${timeEstimate}`);
    await I.see('Directions in relation to hearing');
    await I.clickContinue();
  },

  async verifyWrittenRepresentationsDrawGeneralOrderScreen(representationsType, consentCheck) {
    await I.waitForElement(this.fields.writtenRepresentationsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialWrittenRepresentationsDrawGeneralOrder');
    I.see('Draw a General Order');
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.writtenRepresentationsJudgeRecitalTextArea), consentCheck);
    if ('sequentialRep' === representationsType) {
      await I.see('The respondent may upload any written representations by 4pm on');
      await I.see('The applicant may upload any written representations by 4pm on');
    } else {
      await I.see('The applicant and respondent must respond with written representations by 4pm on');
    }
    await I.clickContinue();
  },
};


