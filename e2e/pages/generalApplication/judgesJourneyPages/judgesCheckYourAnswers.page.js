const {I} = inject();

module.exports = {

  fields: {
    checkAnswerForm: {
      classname: '.check-your-answers',
    }
  },

  async verifyJudgesCheckAnswerForm(caseId) {
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/submit');
    I.see('Check your answers');
    I.seeInCurrentUrl(caseId);
    I.seeNumberOfVisibleElements('.button', 2);
  },
};


