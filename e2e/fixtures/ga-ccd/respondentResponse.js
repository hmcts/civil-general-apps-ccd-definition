const {listElement, element} = require('../../api/dataHelper');
let selectedPba = listElement('PBA0088192');
const validPba = listElement('PBA0088192');
const invalidPba = listElement('PBA0078095');

module.exports = {
  respondGAData: () => {
    return {
      generalAppRespondent1Representative : {
        hasAgreed: 'No'
      },
      hearingDetailsResp: {
        hearingYesorNo: 'No',
        hearingDate: null,
        judgeRequiredYesOrNo: 'No',
        judgeName: null,
        trialRequiredYesOrNo: 'No',
        trialDateFrom: null,
        trialDateTo: null,
        HearingPreferencesPreferredType: 'IN_PERSON',
        TelephoneHearingPreferredType: null,
        ReasonForPreferredHearingType: 'sdsd',
        HearingPreferredLocation: null,
        HearingDetailsTelephoneNumber: '07446778166',
        HearingDetailsEmailID: 'update@gh.com',
        HearingDuration: 'MINUTES_15',
        generalAppHearingDays: null,
        generalAppHearingHours: null,
        generalAppHearingMinutes: null,
        unavailableTrialRequiredYesOrNo: 'No',
        vulnerabilityQuestionsYesOrNo: 'Yes',
        vulnerabilityQuestion: 'Test Answer',
        SupportRequirementSignLanguage: null,
        SupportRequirementLanguageInterpreter: null,
        SupportRequirementOther: null,
        generalAppUnavailableDates: [],
        SupportRequirement: []
      }
    };
  }
};



/*module.exports = {
  respondGAData: () => {
    return {
      respondentsResponses :
        [
          element({
            hearingDetailsResp: {
              hearingYesorNo: 'No',
              hearingDate: null,
              judgeRequiredYesOrNo: 'No',
              judgeName: null,
              trialRequiredYesOrNo: 'No',
              trialDateFrom: null,
              trialDateTo: null,
              HearingPreferencesPreferredType: 'IN_PERSON',
              TelephoneHearingPreferredType: null,
              ReasonForPreferredHearingType: 'sdsd',
              HearingPreferredLocation: null,
              HearingDetailsTelephoneNumber: '07446778166',
              HearingDetailsEmailID: 'update@gh.com',
              HearingDuration: 'MINUTES_15',
              generalAppHearingDays: null,
              generalAppHearingHours: null,
              generalAppHearingMinutes: null,
              unavailableTrialRequiredYesOrNo: 'No',
              vulnerabilityQuestionsYesOrNo: 'Yes',
              vulnerabilityQuestion: 'Test Answer',
              SupportRequirementSignLanguage: null,
              SupportRequirementLanguageInterpreter: null,
              SupportRequirementOther: null,
              generalAppUnavailableDates: [],
              SupportRequirement: []
            },
            generalAppRespondentAgreement: {
              hasAgreed: 'No'
            }
          })
        ]
    };
  }
};*/
