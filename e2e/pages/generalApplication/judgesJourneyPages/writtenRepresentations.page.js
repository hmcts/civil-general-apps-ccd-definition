const {I} = inject();

module.exports = {

  fields: {
    makeAnOrderForWrittenRepresentations: {
      id: '#judicialDecisionMakeAnOrderForWrittenRepresentations_makeAnOrderForWrittenRepresentations',
      options: {
        sequentialRep: 'Sequential representations',
        concurrentRep: 'Concurrent representations',
      }
    },
    sequentialRepDay: '#writtenSequentailRepresentationsBy-day',
    sequentialRepMonth: '#writtenSequentailRepresentationsBy-month',
    sequentialRepYear: '#writtenSequentailRepresentationsBy-year',
    applicantSequentialRepDay: '#sequentialApplicantMustRespondWithin-day',
    applicantSequentialRepMonth: '#sequentialApplicantMustRespondWithin-month',
    applicantSequentialRepYear: '#sequentialApplicantMustRespondWithin-year',
    concurrentRepDay: '#writtenConcurrentRepresentationsBy-day',
    concurrentRepMonth: '#writtenConcurrentRepresentationsBy-month',
    concurrentRepYear: '#writtenConcurrentRepresentationsBy-year',
  },

  async selectWrittenRepresentations(representationsType) {
    I.waitForElement(this.fields.makeAnOrderForWrittenRepresentations.id);
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/JUDGE_MAKES_DECISIONGAJudicialMakeAnOrderForWrittenRepresentations');
    await within(this.fields.makeAnOrderForWrittenRepresentations.id, () => {
      I.click(this.fields.makeAnOrderForWrittenRepresentations.options[representationsType]);
    });
    switch (representationsType) {
      case 'sequentialRep':
        I.see('The applicant may upload any written representations by 4pm on');
        I.see('The respondent may upload any written representations by 4pm on');
        I.fillField(this.fields.sequentialRepDay, '01');
        I.fillField(this.fields.sequentialRepMonth, '01');
        I.fillField(this.fields.sequentialRepYear, '2024');
        I.fillField(this.fields.applicantSequentialRepDay, '01');
        I.fillField(this.fields.applicantSequentialRepMonth, '05');
        I.fillField(this.fields.applicantSequentialRepYear, '2024');
        break;
      case 'concurrentRep':
        I.see('Any written representations and any further witness statements may be uploaded by 4pm on');
        I.fillField(this.fields.concurrentRepDay, '01');
        I.fillField(this.fields.concurrentRepMonth, '01');
        I.fillField(this.fields.concurrentRepYear, '2024');
        break;
    }
    await I.clickContinue();
  }
};

