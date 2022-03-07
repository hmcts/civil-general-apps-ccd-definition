const {I} = inject();

module.exports = {

  fields: {
    judgeDecision: {
      id: '#',
      options: {
        makeAnOrder: 'Make an order',
        requestMoreInfo: 'Request more information',
        listForAHearing: 'List for a hearing',
        orderForWrittenRepresentations: 'Make an order for written representations'
      }
    },
  },

  async selectJudgeDecision(decision) {
    I.waitForElement(this.fields.judgeDecision.id);
    I.seeInCurrentUrl('RESPOND_TO_APPLICATION/RESPOND_TO_APPLICATIONGARespondent1RespScreen');
    I.click(this.fields.judgeDecision.options[decision]);
    await I.clickContinue();
  }
};

