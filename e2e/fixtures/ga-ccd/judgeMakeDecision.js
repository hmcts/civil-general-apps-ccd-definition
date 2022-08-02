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

  },
  judgeMakeDecisionUncloakApplication: () => {
    return {
      judicialDecision : {
        decision: 'MAKE_AN_ORDER'
      },
      judicialDecisionMakeOrder: {
        makeAnOrder: 'APPROVE_OR_EDIT',
        judgeApproveEditOptionDate : '2023-06-05',
        judgeRecitalText:'sample text',
        orderText: 'order sample text',
        reasonForDecisionText: 'sample text'
      },
      makeAppVisibleToRespondents: {
        makeAppAvailableCheck: [
          'ConsentAgreementCheckBox'
        ]
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
    }
  }
};
