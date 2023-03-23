const {I} = inject();
const {verifyJudgeRecitalText, selectCourtsOrderType} = require('../../generalAppCommons');
const date = require('../../../fragments/date');

module.exports = {

  fields: {
    hearingDetailsJudgeRecitalTextArea: '#judicialGeneralHearingOrderRecital',
    hearingDetailsDirectionsTextArea: '#judicialGOHearingDirections',
    writtenRepresentationsJudgeRecitalTextArea: '#judgeRecitalText',
    writtenRepresentationsDirectionsTextArea: '#directionInRelationToHearingText',
    courtOrder: {
      dateId: 'orderCourtOwnInitiativeDate',
      courtOrderText: 'textarea[id*="orderCourtOwnInitiative"]',
    }
  },

  async verifyHearingDetailsGeneralOrderScreen(hearingPreferences, timeEstimate, notice, orderType) {
    await I.waitForElement(this.fields.hearingDetailsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/MAKE_DECISIONGAJudicialHearingDetailsGeneralOrderScreen');
    I.see('Draw a General Order');
    I.see('Judge’s recital');
    await verifyJudgeRecitalText(await I.grabValueFrom(this.fields.hearingDetailsJudgeRecitalTextArea), notice);
    await I.see(`Hearing type is via ${hearingPreferences}`);
    await I.see(`Estimated length of hearing is ${timeEstimate}`);
    await I.see('Directions in relation to hearing');
    await selectCourtsOrderType((await I.grabValueFrom(this.fields.courtOrder.courtOrderText)).trim(), orderType);
    await date.enterDate(this.fields.courtOrder.dateId, +1);
    await I.fillField(this.fields.hearingDetailsDirectionsTextArea, 'Test Directions');
    await I.clickContinue();
  },

  async verifyWrittenRepresentationsDrawGeneralOrderScreen(representationsType, notice, orderType) {
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
    await selectCourtsOrderType((await I.grabValueFrom(this.fields.courtOrder.courtOrderText)).trim(), orderType);
    await date.enterDate(this.fields.courtOrder.dateId, +1);
    await I.fillField(this.fields.writtenRepresentationsDirectionsTextArea, 'Test Directions');
    await I.clickContinue();
  },
};


