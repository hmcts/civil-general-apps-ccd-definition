const {I} = inject();

module.exports = {

  fields: {
    judgeDecision: {
      id: '#judicialDecision_judicialDecision',
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
    I.seeInCurrentUrl('MAKE_DECISION/MAKE_DECISIONGAJudicialDecision');
    await within(this.fields.judgeDecision.id, () => {
      I.click(this.fields.judgeDecision.options[decision]);
    });
    await I.clickContinue();
  }
};

