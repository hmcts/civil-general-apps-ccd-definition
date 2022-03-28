const {I} = inject();
const expect = require('chai').expect;

module.exports = {

  fields: {
    hearingDetailsJudgeRecitalTextArea: '#judicialGeneralHearingOrderRecital',
    hearingDetailsDirectionsTextArea: '#judicialGOHearingDirections',
    writtenRepresentationsJudgeRecitalTextArea: '#judgeRecitalText',
    writtenRepresentationsDirectionsTextArea: '#directionInRelationToHearingText',
  },

  async verifyHearingDetailsGeneralOrderScreen(hearingPreferences, timeEstimate) {
    await I.waitForElement(this.fields.hearingDetailsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/JUDGE_MAKES_DECISIONGAJudicialHearingDetailsGeneralOrderScreen');
    I.see('Judge’s recital');
    let judgeRecitalText = await I.grabValueFrom(this.fields.hearingDetailsJudgeRecitalTextArea);
    expect(judgeRecitalText).to.contains('Upon the application of');
    await I.see(`Hearing type is ${hearingPreferences}`);
    await I.see(`Estimated length of hearing is ${timeEstimate}`);
    await I.see('Directions in relation to hearing');
    let directionText = await I.grabValueFrom(this.fields.hearingDetailsDirectionsTextArea);
    expect(directionText).to.contains('A person who was not notified of the application before this order was made may apply to have the order set aside or varied.');
    await I.clickContinue();
  },

  async verifyWrittenRepresentationsDrawGeneralOrderScreen() {
    await I.waitForElement(this.fields.writtenRepresentationsJudgeRecitalTextArea);
    I.seeInCurrentUrl('/JUDGE_MAKES_DECISIONGAJudicialWrittenRepresentationsDrawGeneralOrder');
    I.see('Judge’s recital');
    let judgeRecitalText = await I.grabValueFrom(this.fields.writtenRepresentationsJudgeRecitalTextArea);
    expect(judgeRecitalText).to.contains('Upon reading the application of Claimant');
    await I.see('The respondent may upload any written representations by 4pm on');
    await I.see('Once the respondent has uploaded written representations, the applicant must respond within 12 days');
    let directionText = await I.grabValueFrom(this.fields.writtenRepresentationsDirectionsTextArea);
    expect(directionText).to.contains('A person who was not notified of the application before this order');
    await I.clickContinue();
  },
};


