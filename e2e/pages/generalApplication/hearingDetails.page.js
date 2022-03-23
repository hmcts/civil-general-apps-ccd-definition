const {I} = inject();

module.exports = {

  fields: {
    hearingScheduled: {
      id: '#generalAppHearingDetails_hearingYesorNo',
      options: {
        yes: 'Yes',
        no: 'No'
      }
    },
    hearingDateDay: '#hearingDate-day',
    hearingDateMonth: '#hearingDate-month',
    hearingDateYear: '#hearingDate-year',
    judgeRequired: {
      id: '#generalAppHearingDetails_judgeRequiredYesOrNo',
      options: {
        yes: 'Yes',
        no: 'No'
      }
    },
    judgeName: '#generalAppHearingDetails_judgeName',
    trialRequired: {
      id: '#generalAppHearingDetails_trialRequiredYesOrNo',
      options: {
        yes: 'Yes',
        no: 'No'
      }
    },
    trialDateFromDay: '#trialDateFrom-day',
    trialDateFromMonth: '#trialDateFrom-month',
    trialDateFromYear: '#trialDateFrom-year',
    trialDateToDay: '#trialDateTo-day',
    trialDateToMonth: '#trialDateTo-month',
    trialDateToYear: '#trialDateTo-year',
    hearingPreferences: {
      id: '#generalAppHearingDetails_HearingPreferencesPreferredType',
      options: {
        inPerson: 'In person',
        videoConferenceHearing: 'Video conference hearing',
        telephoneHearing: 'Telephone hearing',
        withoutAHearing: 'Without a hearing'
      }
    },
    reasonForPreferredHearingType: '#generalAppHearingDetails_ReasonForPreferredHearingType',
    hearingDetailsTelephoneNumber: '#generalAppHearingDetails_HearingDetailsTelephoneNumber',
    hearingDetailsEmailID: '#generalAppHearingDetails_HearingDetailsEmailID',
    hearingDuration: {
      id: '#generalAppHearingDetails_HearingDuration',
      options: {
        fifteenMin: '15 minutes',
        thirtyMin: '30 minutes',
        fortyFiveMin: '45 minutes',
        other: 'Other'
      }
    },
    unavailableTrailRequired: {
      id: '#generalAppHearingDetails_unavailableTrialRequiredYesOrNo_radio',
      options: {
        yes: 'Yes',
        no: 'No'
      }
    },
    unavailableDateFromDay: '#unavailableTrialDateFrom-day',
    unavailableDateFromMonth: '#unavailableTrialDateFrom-month',
    unavailableDateFromYear: '#unavailableTrialDateFrom-year',
    unavailableDateToDay: '#unavailableTrialDateTo-day',
    unavailableDateToMonth: '#unavailableTrialDateTo-month',
    unavailableDateToYear: '#unavailableTrialDateTo-year',
    supportRequirement: {
      id: '#generalAppHearingDetails_SupportRequirement',
      options: {
        disabledAccess: 'Disabled access',
        hearingLoop: 'Hearing loop',
        signLanguageInterpreter: 'Sign language interpreter',
        languageInterpreter: 'Language interpreter',
        otherSupport: 'Other support'
      }
    },
    supportRequirementSignLanguage: '#generalAppHearingDetails_SupportRequirementSignLanguage',
  },

  async isHearingScheduled(hearingScheduledCheck) {
    I.waitForElement(this.fields.hearingScheduled.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONHearingDetails');
    if ('yes' === hearingScheduledCheck) {
      await within(this.fields.hearingScheduled.id, () => {
        I.click(this.fields.hearingScheduled.options[hearingScheduledCheck]);
      });
      await I.fillField(this.fields.hearingDateDay, 1);
      await I.fillField(this.fields.hearingDateMonth, 10);
      await I.fillField(this.fields.hearingDateYear, 2022);
    } else {
      await within(this.fields.hearingScheduled.id, () => {
        I.click(this.fields.hearingScheduled.options[hearingScheduledCheck]);
      });
    }
  },

  async isJudgeRequired(judgeRequired) {
    I.waitForElement(this.fields.judgeRequired.id);
    if ('yes' === judgeRequired) {
      await within(this.fields.judgeRequired.id, () => {
        I.click(this.fields.judgeRequired.options[judgeRequired]);
      });
      await I.fillField(this.fields.judgeName, 'Steve Smith');
    } else {
      await within(this.fields.judgeRequired.id, () => {
        I.click(this.fields.judgeRequired.options[judgeRequired]);
      });
    }
  },

  async isTrialRequired(trialRequired) {
    I.waitForElement(this.fields.trialRequired.id);
    if ('yes' === trialRequired) {
      await within(this.fields.trialRequired.id, () => {
        I.click(this.fields.trialRequired.options[trialRequired]);
      });
      await I.fillField(this.fields.trialDateFromDay, 1);
      await I.fillField(this.fields.trialDateFromMonth, 10);
      await I.fillField(this.fields.trialDateFromYear, 2022);
      await I.fillField(this.fields.trialDateToDay, 1);
      await I.fillField(this.fields.trialDateToMonth, 10);
      await I.fillField(this.fields.trialDateToYear, 2023);
    } else {
      await within(this.fields.trialRequired.id, () => {
        I.click(this.fields.trialRequired.options[trialRequired]);
      });
    }
  },

  async selectHearingPreferences(hearingPreferences) {
    I.waitForElement(this.fields.hearingPreferences.id);
    await within(this.fields.hearingPreferences.id, () => {
      I.click(this.fields.hearingPreferences.options[hearingPreferences]);
    });
    await I.fillField(this.fields.reasonForPreferredHearingType, 'Test Test');
    await I.fillField(this.fields.hearingDetailsTelephoneNumber, '07446775177');
    await I.fillField(this.fields.hearingDetailsEmailID, 'test@gmail.com');
  },

  async selectHearingDuration(hearingDuration) {
    I.waitForElement(this.fields.hearingDuration.id);
    await within(this.fields.hearingDuration.id, () => {
      I.click(this.fields.hearingDuration.options[hearingDuration]);
    });
  },

  async isUnavailableTrailRequired(trailRequired) {
    I.waitForElement(this.fields.unavailableTrailRequired.id);
    if ('yes' === trailRequired) {
      await within(this.fields.unavailableTrailRequired.id, () => {
        I.click(this.fields.unavailableTrailRequired.options[trailRequired]);
        I.wait(2);
        I.click({css: '#generalAppHearingDetails_generalAppUnavailableDates .button:nth-child(2)'});
        I.waitForVisible(this.fields.unavailableDateFromDay);
        I.fillField(this.fields.unavailableDateFromDay, 1);
        I.fillField(this.fields.unavailableDateFromMonth, 10);
        I.fillField(this.fields.unavailableDateFromYear, 2022);
        I.fillField(this.fields.unavailableDateToDay, 1);
        I.fillField(this.fields.unavailableDateToMonth, 10);
        I.fillField(this.fields.unavailableDateToYear, 2023);
      });
    } else {
      await within(this.fields.unavailableTrailRequired.id, () => {
        I.click(this.fields.unavailableTrailRequired.options[trailRequired]);
      });
    }
  },

  async selectSupportRequirement(supportRequirement) {
    I.waitForElement(this.fields.supportRequirement.id);
    await within(this.fields.supportRequirement.id, () => {
      I.click(this.fields.supportRequirement.options[supportRequirement]);
    });
    if ('signLanguageInterpreter' === supportRequirement) {
      await I.fillField(this.fields.supportRequirementSignLanguage, 'SignLanguage');
    }
    await I.clickContinue();
  },

  async updateHearingDetails() {
    I.waitForElement(this.fields.hearingScheduled.id);
    await I.fillField(this.fields.hearingDetailsEmailID, 'update@gmail.com');
    await I.clickContinue();
    await I.clickContinue();
    I.seeInCurrentUrl('/INITIATE_GENERAL_APPLICATION/submit');
    await I.see('update@gmail.com');
  },
};

