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
  judgeMakeOrderWrittenRep: (current_date) => {
    return {
      judicialDecision : {
        decision: 'MAKE_ORDER_FOR_WRITTEN_REPRESENTATIONS'
      },
      judicialDecisionMakeAnOrderForWrittenRepresentations: {
        writtenConcurrentRepresentationsBy: current_date,
        makeAnOrderForWrittenRepresentations: 'CONCURRENT_REPRESENTATIONS'
      },
      judicialByCourtsInitiativeForWrittenRep: 'OPTION_1'
    };
  },
  judgeMakeOrderWrittenRep_On_Uncloaked_Appln: (current_date) => {
    return {
      applicationIsUncloakedOnce: 'Yes',
      generalAppInformOtherParty: {
        isWithNotice: 'Yes',
        reasonsForWithoutNotice: 'Test'
      },
      judicialDecision : {
        decision: 'MAKE_ORDER_FOR_WRITTEN_REPRESENTATIONS'
      },
      judicialDecisionMakeAnOrderForWrittenRepresentations: {
        writtenConcurrentRepresentationsBy: current_date,
        makeAnOrderForWrittenRepresentations: 'CONCURRENT_REPRESENTATIONS'
      },
      judicialByCourtsInitiativeForWrittenRep: 'OPTION_1'
    };
  },
  judgeMakeDecisionDirectionOrder: (current_date) => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'GIVE_DIRECTIONS_WITHOUT_HEARING',
        judicialByCourtsInitiative: 'OPTION_1',
        directionsText: 'sample text',
        reasonForDecisionText: 'sample text',
        directionsResponseByDate: current_date,
        displayjudgeApproveEditOptionDoc: 'No',
        displayjudgeApproveEditOptionDate: 'No',
        isOrderProcessedByStayScheduler: 'No'
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
        reasonForDecisionText: 'sample text',
        isOrderProcessedByStayScheduler: 'No',
        judicialByCourtsInitiative: 'OPTION_1'
      }
    };
  },
  judgeApprovesStayClaimAppl: (current_date) => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'APPROVE_OR_EDIT',
        orderText: 'sample text',
        judgeApproveEditOptionDoc: 'DEFENCE_FORM',
        judgeApproveEditOptionDate: current_date,
        reasonForDecisionText: 'sample text',
        isOrderProcessedByStayScheduler: 'No',
        judicialByCourtsInitiative: 'OPTION_1'
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
        displayjudgeApproveEditOptionDate: 'No',
        judicialByCourtsInitiativeListForHearing: 'OPTION_1'
      },
      judicialListForHearing: {
        hearingPreferencesPreferredType: 'TELEPHONE',
        hearingPreferredLocation: null,
        judicialTimeEstimate: 'MINUTES_30',
        judgeSignLanguage: 'sample text',
        judgeLanguageInterpreter: 'sample text',
        judgeOtherSupport: 'sample text'
      },
      judicialByCourtsInitiativeListForHearing: 'OPTION_1'
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
        displayjudgeApproveEditOptionDate: 'No',
        isOrderProcessedByStayScheduler: 'No',
        judicialByCourtsInitiative: 'OPTION_1'
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
        displayjudgeApproveEditOptionDate: 'No',
        isOrderProcessedByStayScheduler: 'No',
        judicialByCourtsInitiative: 'OPTION_1'
      }
    };

  },
  judgeMakeOrderUncloakApplication: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'APPROVE_OR_EDIT',
        judgeApproveEditOptionDate : '2023-06-05',
        judgeRecitalText:'sample text',
        orderText: 'order sample text',
        reasonForDecisionText: 'sample text',
        isOrderProcessedByStayScheduler: 'No',
        judicialByCourtsInitiative: 'OPTION_1'
      },
      makeAppVisibleToRespondents: {
        makeAppAvailableCheck: [
          'ConsentAgreementCheckBox'
        ]
      }
    };
  },
  judgeRequestMoreInfomationUncloakData: () => {
    return {
      judicialDecision : {
        decision: 'REQUEST_MORE_INFO'
      },
      judicialDecisionRequestMoreInfo: {
        requestMoreInfoOption: 'SEND_APP_TO_OTHER_PARTY',
        judgeRequestMoreInfoText: 'sample data',
        judgeRequestMoreInfoByDate: '2026-05-04'
      }
    };
  },
  serviceUpdateDto:(gaCaseId,paymentStatus)=> {
    return {
      service_request_reference: '1324646546456',
      ccd_case_number: gaCaseId,
      service_request_amount: '167.00',
      service_request_status: paymentStatus,
      payment: {
        _links: null,
        account_number: null,
        amount: 0,
        case_reference: null,
        ccd_case_number: null,
        channel: null,
        currency: null,
        customer_reference: '13246546',
        date_created: '2022-07-26T19:21:50.141Z',
        date_updated: '2022-07-26T19:21:50.141Z',
        description: null,
        external_provider: null,
        external_reference: null,
        fees: null,
        giro_slip_no: '',
        id: '',
        method: '',
        organisation_name: null,
        payment_group_reference: null,
        payment_reference: '13213223',
        reference: null,
        reported_date_offline: null,
        service_name: null,
        site_id: null,
        status: null,
        status_histories: null
      }
    };
  },
  serviceUpdateDtoWithNotice:(gaCaseId,paymentStatus)=> {
    return {
      service_request_reference: '1324646546456',
      ccd_case_number: gaCaseId,
      service_request_amount: '275.00',
      service_request_status: paymentStatus,
      payment: {
        _links: null,
        account_number: null,
        amount: 0,
        case_reference: null,
        ccd_case_number: null,
        channel: null,
        currency: null,
        customer_reference: '13246546',
        date_created: '2022-07-26T19:21:50.141Z',
        date_updated: '2022-07-26T19:21:50.141Z',
        description: null,
        external_provider: null,
        external_reference: null,
        fees: null,
        giro_slip_no: '',
        id: '',
        method: '',
        organisation_name: null,
        payment_group_reference: null,
        payment_reference: '13213223',
        reference: null,
        reported_date_offline: null,
        service_name: null,
        site_id: null,
        status: null,
        status_histories: null
      }
    };
  },
  serviceUpdateDtoWithoutNotice:(gaCaseId,paymentStatus)=> {
    return {
      service_request_reference: '1324646546456',
      ccd_case_number: gaCaseId,
      service_request_amount: '108.00',
      service_request_status: paymentStatus,
      payment: {
        _links: null,
        account_number: null,
        amount: 0,
        case_reference: null,
        ccd_case_number: null,
        channel: null,
        currency: null,
        customer_reference: '13246546',
        date_created: '2022-07-26T19:21:50.141Z',
        date_updated: '2022-07-26T19:21:50.141Z',
        description: null,
        external_provider: null,
        external_reference: null,
        fees: null,
        giro_slip_no: '',
        id: '',
        method: '',
        organisation_name: null,
        payment_group_reference: null,
        payment_reference: '13213223',
        reference: null,
        reported_date_offline: null,
        service_name: null,
        site_id: null,
        status: null,
        status_histories: null
      }
    };
  }
};
