const {I} = inject();

module.exports = {

  fields: {
    requestMoreInfo: {
      id: '#judicialDecisionRequestMoreInfo_requestMoreInfoOption',
      options: {
        requestMoreInformation: 'Request more information',
        sendApplicationToOtherParty: 'Send application to other party and request hearing details'
      }
    },
    judgeRequestMoreInfoTextArea: '#judicialDecisionRequestMoreInfo_judgeRequestMoreInfoText',
    judgeRequestMoreInfoDay: '#judgeRequestMoreInfoByDate-day',
    judgeRequestMoreInfoMonth: '#judgeRequestMoreInfoByDate-month',
    judgeRequestMoreInfoYear: '#judgeRequestMoreInfoByDate-year',
  },

  async requestMoreInfoOrder(info) {
    await I.waitForElement(this.fields.requestMoreInfo.id);
    I.seeInCurrentUrl('JUDGE_MAKES_DECISIONGAJudicialRequestMoreInfoScreen');
    switch (info) {
      case 'requestMoreInfo':
        I.fillField(this.fields.judgeRequestMoreInfoTextArea, 'Judges request more information');
        I.see('Applicant must respond by 4pm on');
        I.fillField(this.fields.judgeRequestMoreInfoDay, '01');
        I.fillField(this.fields.judgeRequestMoreInfoMonth, '01');
        I.fillField(this.fields.judgeRequestMoreInfoYear, '2024');
        break;
      case 'sendApplicationToOtherParty':
        await within(this.fields.requestMoreInfo.id, () => {
          I.click(this.fields.requestMoreInfo.options[info]);
        });
        break;
    }
    await I.clickContinue();
  }
};
