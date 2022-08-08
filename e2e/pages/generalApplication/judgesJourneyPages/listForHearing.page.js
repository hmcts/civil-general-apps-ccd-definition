const {I} = inject();

module.exports = {

  fields: {
    judgeHearingLocation: '#judicialListForHearing_hearingPreferredLocation',
    hearingPreferences: {
      id: '#judicialListForHearing_hearingPreferencesPreferredType',
      options: {
        inPerson: 'In person',
        videoConferenceHearing: 'Video',
        telephoneHearing: 'Telephone'
      }
    },
    judicialTimeEstimate: {
      id: '#judicialListForHearing_judicialTimeEstimate',
      options: {
        fifteenMin: '15 minutes',
        thirtyMin: '30 minutes',
        fortyFiveMin: '45 minutes',
        oneHour: '1 hour',
        other: 'Other'
      }
    },
    judicialSupportRequirement: {
      id: '#judicialListForHearing_judicialSupportRequirement',
      options: {
        disabledAccess: 'Disabled access',
        hearingLoop: 'Hearing loop',
        signLanguageInterpreter: 'Sign language interpreter',
        languageInterpreter: 'Language interpreter',
        otherSupport: 'Other support'
      }
    },
    additionalInfoForCourtStaffTextArea: '#judicialListForHearing_addlnInfoCourtStaff',
  },


  async selectJudicialHearingPreferences(hearingPreferences) {
    I.seeInCurrentUrl('JUDGE_MAKES_DECISION/JUDGE_MAKES_DECISIONGAJudicialHearingDetailsScreen');
    I.waitForElement(this.fields.hearingPreferences.id);
    await within(this.fields.hearingPreferences.id, () => {
      I.click(this.fields.hearingPreferences.options[hearingPreferences]);
    });
    if ('inPerson' === hearingPreferences) {
      await I.see('Select an option from the dropdown');
    }
    await I.see('Applicant prefers In person. ' +
      'Respondent1 prefers In person. ' +
      'Respondent2 prefers In person.');
  },

  async selectJudicialTimeEstimate(timeEstimate) {
    I.waitForElement(this.fields.judicialTimeEstimate.id);
    await within(this.fields.judicialTimeEstimate.id, () => {
      I.click(this.fields.judicialTimeEstimate.options[timeEstimate]);
    });
    await I.see('Applicant estimates 45 minutes. ' +
      'Respondent1 estimates 45 minutes. ' +
      'Respondent2 estimates 45 minutes.');
  },

  async selectJudicialSupportRequirement(supportRequirement) {
    I.waitForElement(this.fields.judicialSupportRequirement.id);
    await I.see('Applicant require Sign language interpreter. ' +
      'Respondent1 require Sign language interpreter. ' +
      'Respondent2 require Sign language interpreter.');
    await within(this.fields.judicialSupportRequirement.id, () => {
      I.click(this.fields.judicialSupportRequirement.options[supportRequirement]);
    });
    await I.fillField(this.fields.additionalInfoForCourtStaffTextArea, 'Information for court staff');
    await I.click('Continue');
    await I.see('Select your preferred hearing location.');
    await I.seeNumberOfVisibleElements(this.fields.judgeHearingLocation, 1);
    await within(this.fields.hearingPreferences.id, () => {
      I.click(this.fields.hearingPreferences.options['videoConferenceHearing']);
    });
    await I.clickContinue();
  },

  async verifyVulnerabilityQuestions() {
    I.seeNumberOfVisibleElements('.case-field .case-field__value span', 5);
    await I.see('Applicant requires support with regards to vulnerability');
    await I.see('Test Test');
  },
};

