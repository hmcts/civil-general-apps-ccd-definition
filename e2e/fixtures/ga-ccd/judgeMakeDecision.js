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
      }
    };
  }
};
