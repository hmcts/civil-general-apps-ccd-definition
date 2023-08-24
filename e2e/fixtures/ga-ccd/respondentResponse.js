const uuid = require('uuid');

const docUuid = uuid.v1();
module.exports = {
  respondConsentGAData: () => {
    return {
      gaRespondentConsent: 'Yes',
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
  }, respondDebtorGAData: () => {
    return {
      generalAppRespondent1Representative : {
        hasAgreed: 'No'
      },
      gaRespondentDebtorOffer: {
        respondentDebtorOffer: 'ACCEPT'
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
  }, respondGAData: () => {
    return {
      generalAppRespondent1Representative : {
        hasAgreed: 'No'
      },
      generalAppRespondReason : 'Not Agree',
      generalAppRespondDocument:[
        {
          id: docUuid,
          value: {
            document_url: '${TEST_DOCUMENT_URL}',
            document_binary_url: '${TEST_DOCUMENT_BINARY_URL}',
            document_filename: '${TEST_DOCUMENT_FILENAME}',
            documentHash: null
          }
        }
      ],
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
  }, toJudgeDirectionsOrders: () => {
    return {
      generalAppDirOrderUpload:[
       {
         id: docUuid,
         value: {
           document_url: '${TEST_DOCUMENT_URL}',
           document_binary_url: '${TEST_DOCUMENT_BINARY_URL}',
           document_filename: '${TEST_DOCUMENT_FILENAME}',
           documentHash: null
         }
      }
    ]
    };
  }, toJudgeAdditionalInfo: () => {
    return {
      generalAppAddlnInfoUpload:[
        {
          id: docUuid,
          value: {
            document_url: '${TEST_DOCUMENT_URL}',
            document_binary_url: '${TEST_DOCUMENT_BINARY_URL}',
            document_filename: '${TEST_DOCUMENT_FILENAME}',
            documentHash: null
          }
        }
      ]
    };
  }, toJudgeWrittenRepresentation: () => {
    return {
      generalAppWrittenRepUpload: [
        {
          id: docUuid,
          value: {
            document_url: '${TEST_DOCUMENT_URL}',
            document_binary_url: '${TEST_DOCUMENT_BINARY_URL}',
            document_filename: '${TEST_DOCUMENT_FILENAME}',
            documentHash: null
          }
        }
      ]
    };
  }
};
