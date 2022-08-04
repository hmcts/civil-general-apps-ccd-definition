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
    judgeRequestMoreInfoRecitalTextArea: '#judicialDecisionRequestMoreInfo_judgeRecitalText',
    judgeRequestMoreInfoDay: '#judgeRequestMoreInfoByDate-day',
    judgeRequestMoreInfoMonth: '#judgeRequestMoreInfoByDate-month',
    judgeRequestMoreInfoYear: '#judgeRequestMoreInfoByDate-year',
    requestInfoRadioButton: '#judicialDecisionRequestMoreInfo_requestMoreInfoOption input',
  },

  async requestMoreInfoOrder(info, withoutNotice) {
    await I.waitForElement(this.fields.requestMoreInfo.id);
    I.seeInCurrentUrl('JUDGE_MAKES_DECISIONGAJudicialRequestMoreInfoScreen');
    if (withoutNotice === 'no') {
      I.seeNumberOfVisibleElements(this.fields.requestInfoRadioButton, 2);
      await within(this.fields.requestMoreInfo.id, () => {
        I.click(this.fields.requestMoreInfo.options[info]);
      });
    } else if (withoutNotice === 'yes') {
      I.dontSee('Send application to other party and request hearing details');
    }
    if ('requestMoreInformation' === info) {
      I.fillField(this.fields.judgeRequestMoreInfoTextArea, 'Judges request more information');
      I.see('When should this application be referred to a Judge again?');
      I.fillField(this.fields.judgeRequestMoreInfoDay, '01');
      I.fillField(this.fields.judgeRequestMoreInfoMonth, '01');
      I.fillField(this.fields.judgeRequestMoreInfoYear, '2024');
      I.fillField(this.fields.judgeRequestMoreInfoRecitalTextArea, 'Request more Info - Judge recital text');
    }
    if ('sendApplicationToOtherParty' === info) {
      I.fillField(this.fields.judgeRequestMoreInfoRecitalTextArea, 'Send Application - Judge recital text');
    }
    await I.clickContinue();
  }
};
