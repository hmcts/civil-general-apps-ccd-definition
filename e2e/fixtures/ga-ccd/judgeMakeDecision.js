module.exports = {
  judgeMakesDecisionData: () => {
    return {
      judicialDecision : {
        decision: 'REQUEST_MORE_INFO'
      },
      judicialDecisionRequestMoreInfo: {
        requestMoreInfoOption: 'REQUEST_MORE_INFORMATION',
        judgeRequestMoreInfoText: 'sample data',
        judgeRequestMoreInfoByDate: '2026-05-04'
      }
    };
  },
  judgeMakeOrderWrittenRep: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_ORDER_FOR_WRITTEN_REPRESENTATIONS'
      },
      judicialDecisionMakeAnOrderForWrittenRepresentations: {
        writtenConcurrentRepresentationsBy: '2026-05-04',
        makeAnOrderForWrittenRepresentations: 'CONCURRENT_REPRESENTATIONS'
      }
    };
  },
  judgeMakeDecisionDirectionOrder: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'GIVE_DIRECTIONS_WITHOUT_HEARING',
        directionsText: 'sample text',
        reasonForDecisionText: 'sample text',
        directionsResponseByDate: '2023-06-05',
        displayjudgeApproveEditOptionDoc: 'No',
        displayjudgeApproveEditOptionDate: 'No'
      }
    };
  },
  judgeApprovesStrikeOutAppl: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'APPROVE_OR_EDIT',
        orderText: 'sample text',
        judgeApproveEditOptionDoc: 'DEFENCE_FORM',
        judgeApproveEditOptionDate: '2023-06-05',
        reasonForDecisionText: 'sample text'
      }
    };
  },
  listingForHearing: () => {
    return {
      judicialDecision : {
        decision: 'LIST_FOR_A_HEARING'
      },
      judicialDecisionMakeOrder: {
        directionsText: 'sample text',
        reasonForDecisionText: 'sample text',
        directionsResponseByDate: '2023-06-05',
        displayjudgeApproveEditOptionDoc: 'No',
        displayjudgeApproveEditOptionDate: 'No'
      },
      judicialListForHearing: {
        hearingPreferredLocation: null,
        judgeSignLanguage: 'sample text',
        judgeLanguageInterpreter: 'sample text',
        judgeOtherSupport: 'sample text'
      }
    };
  },
  applicationsDismiss: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'DISMISS_THE_APPLICATION',
        reasonForDecisionText: 'sample text',
        directionsResponseByDate: '2023-06-05',
        displayjudgeApproveEditOptionDoc: 'No',
        displayjudgeApproveEditOptionDate: 'No'
      }
    };
  },
  judgeMakeDecisionDismissed: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'DISMISS_THE_APPLICATION',
        judgeRecitalText:'sample text',
        orderText:'sample text',
        dismissalOrderText:'sample text',
        reasonForDecisionText:'sample text',
        displayjudgeApproveEditOptionDoc: 'No',
        displayjudgeApproveEditOptionDate: 'No'
      }
    };
  }
};
