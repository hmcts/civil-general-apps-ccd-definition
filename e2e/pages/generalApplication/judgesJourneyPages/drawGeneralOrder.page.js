const {I} = inject();
const {verifyJudgeRecitalText, selectJudicialByCourtsInitiativeOption} = require('../../generalAppCommons');

module.exports = {

  fields: {
    hearingDetailsJudgeRecitalTextArea: '#judicialGeneralHearingOrderRecital',
    hearingDetailsDirectionsTextArea: '#judicialGOHearingDirections',
    writtenRepresentationsJudgeRecitalTextArea: '#judgeRecitalText',
    writtenRepresentationsDirectionsTextArea: '#directionInRelationToHearingText',
  },

  async verifyHearingDetailsGeneralOrderScreen(hearingPreferences, timeEstimate, notice) {
    await I.waitForElement(this.fields.hearingDetailsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialHearingDetailsGeneralOrderScreen');
    I.see('Draw a General Order');
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.hearingDetailsJudgeRecitalTextArea), notice);
    await I.see(`Hearing type is ${hearingPreferences}`);
    await I.see(`Estimated length of hearing is ${timeEstimate}`);
    await I.see('Directions in relation to hearing');
    await selectJudicialByCourtsInitiativeOption();
    await I.fillField(this.fields.hearingDetailsDirectionsTextArea, 'Test Directions');
    await I.clickContinue();
  },

  async verifyWrittenRepresentationsDrawGeneralOrderScreen(representationsType, notice) {
    await I.waitForElement(this.fields.writtenRepresentationsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialWrittenRepresentationsDrawGeneralOrder');
    I.see('Draw a General Order');
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.writtenRepresentationsJudgeRecitalTextArea), notice);
    if ('sequentialRep' === representationsType) {
      await I.see('The respondent may upload any written representations by 4pm on');
      await I.see('The applicant may upload any written representations by 4pm on');
    } else {
      await I.see('The applicant and respondent may respond with written representations by 4pm on');
    }
    await selectJudicialByCourtsInitiativeOption();
    await I.fillField(this.fields.writtenRepresentationsDirectionsTextArea, 'Test Directions');
    await I.clickContinue();
  },
};


