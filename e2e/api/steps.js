const config = require('../config.js');
const lodash = require('lodash');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');

chai.use(deepEqualInAnyOrder);
chai.config.truncateThreshold = 0;
const {expect, assert} = chai;

const {
  waitForFinishedBusinessProcess,
  waitForGAFinishedBusinessProcess,
  waitForGACamundaEventsFinishedBusinessProcess
} = require('../api/testingSupport');
const {assignCaseRoleToUser, addUserCaseMapping, unAssignAllUsers} = require('./caseRoleAssignmentHelper');
const apiRequest = require('./apiRequest.js');
const claimData = require('../fixtures/events/createClaim.js');
const claimSpecData = require('../fixtures/events/createClaimSpec.js');
const genAppData = require('../fixtures/ga-ccd/createGeneralApplication.js');
const genAppRespondentResponseData = require('../fixtures/ga-ccd/respondentResponse.js');
const genAppJudgeMakeDecisionData = require('../fixtures/ga-ccd/judgeMakeDecision.js');
const events = require('../fixtures/ga-ccd/events.js');
const testingSupport = require('./testingSupport');

const data = {
  INITIATE_GENERAL_APPLICATION: genAppData.createGAData('Yes',null,
    '27500','FEE0442'),
  INITIATE_GENERAL_APPLICATION_WITHOUT_NOTICE: genAppData.createGADataWithoutNotice('No','Test 123',
    '10800','FEE0443'),
  RESPOND_TO_APPLICATION: genAppRespondentResponseData.respondGAData(),
  MAKE_DECISION: genAppJudgeMakeDecisionData.judgeMakesDecisionData(),
  JUDGE_MAKES_ORDER_WRITTEN_REP: genAppJudgeMakeDecisionData.judgeMakeOrderWrittenRep(),
  RESPOND_TO_JUDGE_ADDITIONAL_INFO: genAppRespondentResponseData.toJudgeAdditionalInfo(),
  RESPOND_TO_JUDGE_DIRECTIONS: genAppRespondentResponseData.toJudgeDirectionsOrders(),
  RESPOND_TO_JUDGE_WRITTEN_REPRESENTATION: genAppRespondentResponseData.toJudgeWrittenRepresentation(),
  JUDGE_MAKES_ORDER_DIRECTIONS_REP: genAppJudgeMakeDecisionData.judgeMakeDecisionDirectionOrder(),
  PAYMENT_SERVICE_REQUEST_UPDATED: genAppJudgeMakeDecisionData.serviceUpdateDto(),
  LIST_FOR_A_HEARING: genAppJudgeMakeDecisionData.listingForHearing(),
  APPLICATION_DISMISSED: genAppJudgeMakeDecisionData.applicationsDismiss(),
  JUDGE_MAKES_ORDER_DISMISS: genAppJudgeMakeDecisionData.judgeMakeDecisionDismissed(),
  CREATE_CLAIM: (mpScenario) => claimData.createClaim(mpScenario),
  CREATE_SPEC_CLAIM: (mpScenario) => claimSpecData.createClaim(mpScenario),
  CREATE_CLAIM_RESPONDENT_LIP: claimData.createClaimLitigantInPerson,
  CREATE_CLAIM_TERMINATED_PBA: claimData.createClaimWithTerminatedPBAAccount,
  CREATE_CLAIM_RESPONDENT_SOLICITOR_FIRM_NOT_IN_MY_HMCTS: claimData.createClaimRespondentSolFirmNotInMyHmcts,
  JUDGE_MAKES_ORDER_DISMISS_UNCLOAK: genAppJudgeMakeDecisionData.judgeMakeDecisionUncloakApplication(),
  RESUBMIT_CLAIM: require('../fixtures/events/resubmitClaim.js'),
  NOTIFY_DEFENDANT_OF_CLAIM: require('../fixtures/events/1v2DifferentSolicitorEvents/notifyClaim_1v2DiffSol.js'),
  NOTIFY_DEFENDANT_OF_CLAIM_DETAILS: require('../fixtures/events/1v2DifferentSolicitorEvents/notifyClaim_1v2DiffSol.js'),
  ADD_OR_AMEND_CLAIM_DOCUMENTS: require('../fixtures/events/addOrAmendClaimDocuments.js'),
  ACKNOWLEDGE_CLAIM: require('../fixtures/events/acknowledgeClaim.js'),
  ACKNOWLEDGE_CLAIM_SAME_SOLICITOR: require('../fixtures/events/1v2SameSolicitorEvents/acknowledgeClaim_sameSolicitor.js'),
  ACKNOWLEDGE_CLAIM_SOLICITOR_ONE: require('../fixtures/events/1v2DifferentSolicitorEvents/acknowledgeClaim_Solicitor1.js'),
  ACKNOWLEDGE_CLAIM_SOLICITOR_TWO: require('../fixtures/events/1v2DifferentSolicitorEvents/acknowledgeClaim_Solicitor2.js'),
  INFORM_AGREED_EXTENSION_DATE: require('../fixtures/events/informAgreeExtensionDate.js'),
  INFORM_AGREED_EXTENSION_DATE_SOLICITOR_TWO: require('../fixtures/events/1v2DifferentSolicitorEvents/informAgreeExtensionDate_Solicitor2.js'),
  DEFENDANT_RESPONSE: require('../fixtures/events/defendantResponse.js'),
  DEFENDANT_RESPONSE_SAME_SOLICITOR: require('../fixtures/events/1v2SameSolicitorEvents/defendantResponse_sameSolicitor.js'),
  DEFENDANT_RESPONSE_SOLICITOR_ONE: require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor1'),
  DEFENDANT_RESPONSE_SOLICITOR_TWO: require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor2'),
  DEFENDANT_RESPONSE_TWO_APPLICANTS: require('../fixtures/events/2v1Events/defendantResponse_2v1'),
  CLAIMANT_RESPONSE: require('../fixtures/events/claimantResponse.js'),
  ADD_DEFENDANT_LITIGATION_FRIEND: require('../fixtures/events/addDefendantLitigationFriend.js'),
  CASE_PROCEEDS_IN_CASEMAN: require('../fixtures/events/caseProceedsInCaseman.js'),
  AMEND_PARTY_DETAILS: require('../fixtures/events/amendPartyDetails.js'),
  ADD_CASE_NOTE: require('../fixtures/events/addCaseNote.js')
};

const midEventFieldForPage = {
  ClaimValue: {
    id: 'applicantSolicitor1PbaAccounts',
    dynamicList: true,
    uiField: {
      remove: false,
    },
  },
  ClaimantLitigationFriend: {
    id: 'applicantSolicitor1CheckEmail',
    dynamicList: false,
    uiField: {
      remove: false,
    },
  },
  StatementOfTruth: {
    id: 'applicantSolicitor1ClaimStatementOfTruth',
    dynamicList: false,
    uiField: {
      remove: true,
      field: 'uiStatementOfTruth'
    },
  }
};

let caseId, eventName;
let caseData = {};
let mpScenario = 'ONE_V_ONE';

module.exports = {

  createUnspecifiedClaim: async (user, multipartyScenario) => {

    eventName = 'CREATE_CLAIM';
    caseId = null;
    caseData = {};
    mpScenario = multipartyScenario;
    const createClaimData = data.CREATE_CLAIM(mpScenario);

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName);
    await validateEventPages(createClaimData);

    let i;
    for (i = 0; i < createClaimData.invalid.Court.courtLocation.applicantPreferredCourt.length; i++) {
      await assertError('Court', createClaimData.invalid.Court.courtLocation.applicantPreferredCourt[i],
        null, 'Case data validation failed');
    }
    await assertError('Upload', createClaimData.invalid.Upload.servedDocumentFiles.particularsOfClaimDocument,
      null, 'Case data validation failed');

    await assertSubmittedEvent('PENDING_CASE_ISSUED', {
      header: 'Your claim has been received',
      body: 'Your claim will not be issued until payment is confirmed.'
    });

    await assignCase(caseId, multipartyScenario);
    await waitForFinishedBusinessProcess(caseId);

    //field is deleted in about to submit callback
    deleteCaseFields('applicantSolicitor1CheckEmail');
    return caseId;
  },

  createSpecifiedClaim: async (user, multipartyScenario) => {

    eventName = 'CREATE_CLAIM_SPEC';
    caseId = null;
    caseData = {};
    const createClaimSpecData = data.CREATE_SPEC_CLAIM(multipartyScenario);

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName);
    for (let pageId of Object.keys(createClaimSpecData.userInput)) {
      await assertValidDataSpec(createClaimSpecData, pageId);
    }

    await assertSubmittedSpecEvent('PENDING_CASE_ISSUED');

    await assignSpecCase(caseId, multipartyScenario);
    await waitForFinishedBusinessProcess(caseId);

    //field is deleted in about to submit callback
    deleteCaseFields('applicantSolicitor1CheckEmail');
    return caseId;
  },

  initiateGeneralApplication: async (user, parentCaseId) => {
    eventName = events.INITIATE_GENERAL_APPLICATION.id;

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, parentCaseId);
    const response = await apiRequest.submitEvent(eventName, data.INITIATE_GENERAL_APPLICATION, parentCaseId);
    const responseBody = await response.json();
    assert.equal(response.status, 201);
    assert.equal(responseBody.state, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    console.log('General application case state : AWAITING_RESPONDENT_ACKNOWLEDGEMENT ');
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, '# You have made an application');
    await waitForFinishedBusinessProcess(parentCaseId);
    await waitForGAFinishedBusinessProcess(parentCaseId);

    const updatedResponse = await apiRequest.fetchUpdatedCaseData(parentCaseId);
    const updatedCivilCaseData = await updatedResponse.json();
    let gaCaseReference = updatedCivilCaseData.generalApplicationsDetails[0].value.caseLink.CaseReference;
    console.log('*** GA Case Reference: ' + gaCaseReference + ' ***');

    return gaCaseReference;
  },

  initiateGeneralApplicationWithOutNotice: async (user, parentCaseId) => {
    eventName = events.INITIATE_GENERAL_APPLICATION.id;

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, parentCaseId);

    const response = await apiRequest.submitEvent(eventName, data.INITIATE_GENERAL_APPLICATION_WITHOUT_NOTICE,
      parentCaseId);

    const responseBody = await response.json();
    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header,
      '# You have made an application');

    await waitForFinishedBusinessProcess(parentCaseId);
    await waitForGAFinishedBusinessProcess(parentCaseId);

    const updatedResponse = await apiRequest.fetchUpdatedCaseData(parentCaseId);
    const updatedCivilCaseData = await updatedResponse.json();
    let gaCaseReference = updatedCivilCaseData.generalApplicationsDetails[0].value.caseLink.CaseReference;

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference,
      'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseReference);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');

    console.log('General application case state : APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
    console.log('*** GA Case Reference: ' + gaCaseReference + ' ***');

    return gaCaseReference;
  },

  getGACaseReference: async (user, parentCaseId) => {
    eventName = events.INITIATE_GENERAL_APPLICATION.id;

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, parentCaseId);
    const updatedResponse = await apiRequest.fetchUpdatedCaseData(parentCaseId);
    const updatedCivilCaseData = await updatedResponse.json();
    let gaCaseReference = updatedCivilCaseData.generalApplicationsDetails[0].value.caseLink.CaseReference;
    console.log('*** GA Case Reference: ' + gaCaseReference + ' ***');

    return gaCaseReference;
  },

  respondentResponse: async (user, gaCaseId) => {
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'AWAITING_RESPONDENT_RESPONSE');

    await apiRequest.setupTokens(user);
    eventName = events.RESPOND_TO_APPLICATION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.RESPOND_TO_APPLICATION, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.state, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, '# You have provided the requested information');
  },

  respondentResponse1v2: async (user, user2, gaCaseId) => {
    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'AWAITING_RESPONDENT_RESPONSE');

    await apiRequest.setupTokens(user);
    eventName = events.RESPOND_TO_APPLICATION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.RESPOND_TO_APPLICATION, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.state, 'AWAITING_RESPONDENT_RESPONSE');
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, '# You have provided the requested information');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'AWAITING_RESPONDENT_RESPONSE');

    await apiRequest.setupTokens(user2);
    eventName = events.RESPOND_TO_APPLICATION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response2 = await apiRequest.submitGAEvent(eventName, data.RESPOND_TO_APPLICATION, gaCaseId);
    const responseBody2 = await response2.json();

    assert.equal(response2.status, 201);
    assert.equal(responseBody2.state, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
    assert.equal(responseBody2.callback_response_status_code, 200);
    assert.include(responseBody2.after_submit_callback_response.confirmation_header, '# You have provided the requested information');
  },

  judgeMakesDecisionAdditionalInformation: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.MAKE_DECISION, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, '# You have requested more information');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_ADDITIONAL_INFORMATION');
  },

  judgeMakesDecisionApplicationDismiss: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_DISMISS, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_DISMISSED');
  },

  judgeMakesDecisionApplicationUncloak: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_DISMISS_UNCLOAK, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'APPLICATION_ADD_PAYMENT');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_ADD_PAYMENT');
  },

  additionalPaymentSuccess: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;

    const response = await apiRequest.paymentApiRequestUpdateServiceCallback(
      genAppJudgeMakeDecisionData.serviceUpdateDto(gaCaseId,'Paid'));

    assert.equal(response.status, 200);

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'ORDER_MADE');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'ORDER_MADE');
  },

  additionalPaymentFailure: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;

    const response = await apiRequest.paymentApiRequestUpdateServiceCallback(
      genAppJudgeMakeDecisionData.serviceUpdateDto(gaCaseId,'NotPaid'));

    assert.equal(response.status, 200);

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'ORDER_MADE');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_ADD_PAYMENT');
  },

  respondentResponseToJudgeAdditionalInfo: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.RESPOND_TO_JUDGE_ADDITIONAL_INFO.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    console.log('*** respondentResponseToJudgeDirections: Start uploading the document ***');
    const document = await testingSupport.uploadDocument();
    let casaData = await updateCaseDataWithPlaceholders(data[eventName], document);
    console.log('*** respondentResponseToJudgeDirections: Finish uploading the document ***');

    const response = await apiRequest.submitGAEvent(eventName, casaData, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.equal(responseBody.state, 'AWAITING_ADDITIONAL_INFORMATION');
  },

  respondentResponseToWrittenRepresentations: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.RESPOND_TO_JUDGE_WRITTEN_REPRESENTATION.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    console.log('*** respondentResponseToJudgeDirections: Start uploading the document ***');
    const document = await testingSupport.uploadDocument();
    let casaData = await updateCaseDataWithPlaceholders(data[eventName], document);
    console.log('*** respondentResponseToJudgeDirections: Finish uploading the document ***');

    const response = await apiRequest.submitGAEvent(eventName, casaData, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.equal(responseBody.state, 'AWAITING_WRITTEN_REPRESENTATIONS');
  },

  respondentResponseToJudgeDirections: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.RESPOND_TO_JUDGE_DIRECTIONS.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    console.log('*** respondentResponseToJudgeDirections: Start uploading the document ***');
    const document = await testingSupport.uploadDocument();
    let casaData = await updateCaseDataWithPlaceholders(data[eventName], document);
    console.log('*** respondentResponseToJudgeDirections: Finish uploading the document ***');

    const response = await apiRequest.submitGAEvent(eventName, casaData, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.equal(responseBody.state, 'AWAITING_DIRECTIONS_ORDER_DOCS');
  },

  judgeMakesDecisionWrittenRep: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_WRITTEN_REP, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_WRITTEN_REPRESENTATIONS');
  },

  judgeMakesDecisionDirectionsOrder: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_DIRECTIONS_REP, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_DIRECTIONS_ORDER_DOCS');
  },

  judgeListApplicationForHearing: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.LIST_FOR_A_HEARING, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'LISTING_FOR_A_HEARING');
  },

  judgeDismissApplication: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.MAKE_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.APPLICATION_DISMISSED, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'MAKE_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_DISMISSED');
  },

  notifyClaim: async (user, multipartyScenario, caseId) => {
    eventName = 'NOTIFY_DEFENDANT_OF_CLAIM';
    mpScenario = multipartyScenario;

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, caseId);

    await validateEventPages(data[eventName]);

    await assertSubmittedEvent('AWAITING_CASE_DETAILS_NOTIFICATION', {
      header: 'Notification of claim sent',
      body: 'The defendant legal representative\'s organisation has been notified and granted access to this claim.'
    });

    await waitForFinishedBusinessProcess(caseId);
  },

  notifyClaimDetails: async (user, caseId) => {
    await apiRequest.setupTokens(user);

    eventName = 'NOTIFY_DEFENDANT_OF_CLAIM_DETAILS';
    await apiRequest.startEvent(eventName, caseId);

    await validateEventPages(data[eventName]);

    await assertSubmittedEvent('AWAITING_RESPONDENT_ACKNOWLEDGEMENT', {
      header: 'Defendant notified',
      body: 'The defendant legal representative\'s organisation has been notified of the claim details.'
    });

    await waitForFinishedBusinessProcess(caseId);
  },

  cleanUp: async () => {
    await unAssignAllUsers();
  }
};

// Functions
const validateEventPages = async (data, solicitor) => {
  //transform the data
  console.log('validateEventPages');
  for (let pageId of Object.keys(data.valid)) {
    if (pageId === 'Upload' || pageId === 'DraftDirections' || pageId === 'ApplicantDefenceResponseDocument' || pageId === 'DraftDirections') {
      const document = await testingSupport.uploadDocument();
      data = await updateCaseDataWithPlaceholders(data, document);
    }
    // data = await updateCaseDataWithPlaceholders(data);
    await assertValidData(data, pageId, solicitor);
  }
};

const assertValidDataSpec = async (data, pageId) => {
  console.log(`asserting page: ${pageId} has valid data`);

  const userData = data.userInput[pageId];
  caseData = update(caseData, userData);
  const response = await apiRequest.validatePage(
    eventName,
    pageId,
    caseData,
    caseId
  );
  let responseBody = await response.json();

  assert.equal(response.status, 200);

  if (data.midEventData && data.midEventData[pageId]) {
    checkExpected(responseBody.data, data.midEventData[pageId]);
  }

  if (data.midEventGeneratedData && data.midEventGeneratedData[pageId]) {
    checkGenerated(responseBody.data, data.midEventGeneratedData[pageId]);
  }

  caseData = update(caseData, responseBody.data);
};

function update(currentObject, modifications) {
  const modified = {...currentObject};
  for (const key in modifications) {
    if (currentObject[key] && typeof currentObject[key] === 'object') {
      if (Array.isArray(currentObject[key])) {
        modified[key] = modifications[key];
      } else {
        modified[key] = update(currentObject[key], modifications[key]);
      }
    } else {
      modified[key] = modifications[key];
    }
  }
  return modified;
}

function checkExpected(responseBodyData, expected, prefix = '') {
  if (!(responseBodyData) && expected) {
    if (expected) {
      assert.fail('Response' + prefix ? '[' + prefix + ']' : '' + ' is empty but it was expected to be ' + expected);
    } else {
      // null and undefined may reach this point bc typeof null is object
      return;
    }
  }
  for (const key in expected) {
    if (Object.prototype.hasOwnProperty.call(expected, key)) {
      if (typeof expected[key] === 'object') {
        checkExpected(responseBodyData[key], expected[key], key + '.');
      } else {
        assert.equal(responseBodyData[key], expected[key], prefix + key + ': expected ' + expected[key]
          + ' but actual ' + responseBodyData[key]);
      }
    }
  }
}

function checkGenerated(responseBodyData, generated, prefix = '') {
  if (!(responseBodyData)) {
    assert.fail('Response' + prefix ? '[' + prefix + ']' : '' + ' is empty but it was not expected to be');
  }
  for (const key in generated) {
    if (Object.prototype.hasOwnProperty.call(generated, key)) {
      const checkType = function (type) {
        if (type === 'array') {
          assert.isTrue(Array.isArray(responseBodyData[key]),
            'responseBody[' + prefix + key + '] was expected to be an array');
        } else {
          assert.equal(typeof responseBodyData[key], type,
            'responseBody[' + prefix + key + '] was expected to be of type ' + type);
        }
      };
      const checkFunction = function (theFunction) {
        assert.isTrue(theFunction.call(responseBodyData[key], responseBodyData[key]),
          'responseBody[' + prefix + key + '] does not satisfy the condition it should');
      };
      if (typeof generated[key] === 'string') {
        checkType(generated[key]);
      } else if (typeof generated[key] === 'function') {
        checkFunction(generated[key]);
      } else if (typeof generated[key] === 'object') {
        if (generated[key]['type']) {
          checkType(generated[key]['type']);
        }
        if (generated[key]['condition']) {
          checkType(generated[key]['condition']);
        }
        for (const key2 in generated[key]) {
          if (Object.prototype.hasOwnProperty.call(generated, key2) && 'condition' !== key2 && 'type' !== key2) {
            checkGenerated(responseBodyData[key2], generated[key2], key2 + '.');
          }
        }
      }
    }
  }
}

const assertValidData = async (data, pageId, solicitor) => {
  console.log(`asserting page: ${pageId} has valid data`);

  const validDataForPage = data.valid[pageId];
  caseData = {...caseData, ...validDataForPage};
  const response = await apiRequest.validatePage(
    eventName,
    pageId,
    caseData,
    isDifferentSolicitorForDefendantResponseOrExtensionDate() ? caseId : null
  );
  let responseBody;

  if (eventName === 'INFORM_AGREED_EXTENSION_DATE' && mpScenario === 'ONE_V_TWO_TWO_LEGAL_REP') {
    responseBody = clearDataForExtensionDate(await response.json(), solicitor);
  } else if (eventName === 'DEFENDANT_RESPONSE' && mpScenario === 'ONE_V_TWO_TWO_LEGAL_REP') {
    responseBody = clearDataForDefendantResponse(await response.json(), solicitor);
  } else {
    responseBody = await response.json();
  }

  assert.equal(response.status, 200);

  // eslint-disable-next-line no-prototype-builtins
  if (midEventFieldForPage.hasOwnProperty(pageId)) {
    addMidEventFields(pageId, responseBody);
    caseData = removeUiFields(pageId, caseData);
  }

  assert.deepEqual(responseBody.data, caseData);
};

function removeUiFields(pageId, caseData) {
  console.log(`Removing ui fields for pageId: ${pageId}`);
  const midEventField = midEventFieldForPage[pageId];

  if (midEventField.uiField.remove === true) {
    const fieldToRemove = midEventField.uiField.field;
    delete caseData[fieldToRemove];
  }
  return caseData;
}

const assertError = async (pageId, eventData, expectedErrorMessage, responseBodyMessage = 'Unable to proceed because there are one or more callback Errors or Warnings') => {
  const response = await apiRequest.validatePage(
    eventName,
    pageId,
    {...caseData, ...eventData},
    isDifferentSolicitorForDefendantResponseOrExtensionDate ? caseId : null,
    422
  );

  const responseBody = await response.json();

  assert.equal(response.status, 422);
  assert.equal(responseBody.message, responseBodyMessage);
  if (responseBody.callbackErrors != null) {
    assert.equal(responseBody.callbackErrors[0], expectedErrorMessage);
  }
};

const assertSubmittedEvent = async (expectedState, submittedCallbackResponseContains, hasSubmittedCallback = true) => {
  await apiRequest.startEvent(eventName, caseId);

  const response = await apiRequest.submitEvent(eventName, caseData, caseId);
  const responseBody = await response.json();
  assert.equal(response.status, 201);
  assert.equal(responseBody.state, expectedState);
  if (hasSubmittedCallback) {
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, submittedCallbackResponseContains.header);
    assert.include(responseBody.after_submit_callback_response.confirmation_body, submittedCallbackResponseContains.body);
  }

  if (eventName === 'CREATE_CLAIM') {
    caseId = responseBody.id;
    await addUserCaseMapping(caseId, config.applicantSolicitorUser);
    console.log('Case created: ' + caseId);
  }
};

const assertSubmittedSpecEvent = async (expectedState, submittedCallbackResponseContains, hasSubmittedCallback = true) => {
  await apiRequest.startEvent(eventName, caseId);

  const response = await apiRequest.submitEvent(eventName, caseData, caseId);
  const responseBody = await response.json();
  assert.equal(response.status, 201);
  assert.equal(responseBody.state, expectedState);
  if (hasSubmittedCallback && submittedCallbackResponseContains) {
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, submittedCallbackResponseContains.header);
    assert.include(responseBody.after_submit_callback_response.confirmation_body, submittedCallbackResponseContains.body);
  }

  if (eventName === 'CREATE_CLAIM_SPEC') {
    caseId = responseBody.id;
    await addUserCaseMapping(caseId, config.applicantSolicitorUser);
    console.log('Case created: ' + caseId);
  }
};
// Mid event will not return case fields that were already filled in another event if they're present on currently processed event.
// This happens until these case fields are set again as a part of current event (note that this data is not removed from the case).
// Therefore these case fields need to be removed from caseData, as caseData object is used to make assertions
const deleteCaseFields = (...caseFields) => {
  caseFields.forEach(caseField => delete caseData[caseField]);
};

// const assertCaseNotAvailableToUser = async (user) => {
//   console.log(`Asserting user ${user.type} does not have permission to case`);
//   const caseForDisplay = await apiRequest.fetchCaseForDisplay(user, caseId, 404);
//   assert.equal(caseForDisplay.message, `No case found for reference: ${caseId}`);
// };

function addMidEventFields(pageId, responseBody) {
  console.log(`Adding mid event fields for pageId: ${pageId}`);
  const midEventField = midEventFieldForPage[pageId];
  let midEventData;

  if (eventName === 'CREATE_CLAIM') {
    midEventData = data[eventName](mpScenario).midEventData[pageId];
  } else {
    midEventData = data[eventName].midEventData[pageId];
  }

  if (midEventField.dynamicList === true) {
    assertDynamicListListItemsHaveExpectedLabels(responseBody, midEventField.id, midEventData);
  }

  caseData = {...caseData, ...midEventData};
  responseBody.data[midEventField.id] = caseData[midEventField.id];
}

function assertDynamicListListItemsHaveExpectedLabels(responseBody, dynamicListFieldName, midEventData) {
  const actualDynamicElementLabels = removeUuidsFromDynamicList(responseBody.data, dynamicListFieldName);
  const expectedDynamicElementLabels = removeUuidsFromDynamicList(midEventData, dynamicListFieldName);

  expect(actualDynamicElementLabels).to.deep.equalInAnyOrder(expectedDynamicElementLabels);
}

function removeUuidsFromDynamicList(data, dynamicListField) {
  const dynamicElements = data[dynamicListField].list_items;
  // eslint-disable-next-line no-unused-vars
  return dynamicElements.map(({code, ...item}) => item);
}

async function updateCaseDataWithPlaceholders(data, document) {
  const placeholders = {
    TEST_DOCUMENT_URL: document.document_url,
    TEST_DOCUMENT_BINARY_URL: document.document_binary_url,
    TEST_DOCUMENT_FILENAME: document.document_filename
  };

  data = lodash.template(JSON.stringify(data))(placeholders);

  return JSON.parse(data);
}

const assignCase = async (caseId, mpScenario) => {
  await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORONE', config.defendantSolicitorUser);
  switch (mpScenario) {
    case 'ONE_V_TWO_TWO_LEGAL_REP': {
      await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORTWO', config.secondDefendantSolicitorUser);
      break;
    }
    case 'ONE_V_TWO_ONE_LEGAL_REP': {
      await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORONE', config.defendantSolicitorUser);
      break;
    }
  }
};

const assignSpecCase = async (caseId, mpScenario) => {
  await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORONESPEC', config.defendantSolicitorUser);
  switch (mpScenario) {
    case 'ONE_V_TWO_TWO_LEGAL_REP': {
      await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORTWOSPEC', config.secondDefendantSolicitorUser);
      break;
    }
    case 'ONE_V_TWO_ONE_LEGAL_REP': {
      await assignCaseRoleToUser(caseId, 'RESPONDENTSOLICITORONESPEC', config.defendantSolicitorUser);
      break;
    }
  }
};

const clearDataForExtensionDate = (responseBody, solicitor) => {
  delete responseBody.data['businessProcess'];
  delete responseBody.data['caseNotes'];
  delete responseBody.data['systemGeneratedCaseDocuments'];

  // solicitor cannot see data from respondent they do not represent
  if (solicitor === 'solicitorTwo') {
    delete responseBody.data['respondent1'];
  } else {
    delete responseBody.data['respondent2'];
  }
  return responseBody;
};

const clearDataForDefendantResponse = (responseBody, solicitor) => {
  delete responseBody.data['businessProcess'];
  delete responseBody.data['caseNotes'];
  delete responseBody.data['systemGeneratedCaseDocuments'];
  delete responseBody.data['respondentSolicitor2Reference'];

  // solicitor cannot see data from respondent they do not represent
  if (solicitor === 'solicitorTwo') {
    delete responseBody.data['respondent1'];
    delete responseBody.data['respondent1ClaimResponseType'];
    delete responseBody.data['respondent1ClaimResponseDocument'];
    delete responseBody.data['respondent1DQFileDirectionsQuestionnaire'];
    delete responseBody.data['respondent1DQDisclosureOfElectronicDocuments'];
    delete responseBody.data['respondent1DQDisclosureOfNonElectronicDocuments'];
    delete responseBody.data['respondent1DQExperts'];
    delete responseBody.data['respondent1DQWitnesses'];
    delete responseBody.data['respondent1DQLanguage'];
    delete responseBody.data['respondent1DQHearing'];
    delete responseBody.data['respondent1DQDraftDirections'];
    delete responseBody.data['respondent1DQRequestedCourt'];
    delete responseBody.data['respondent1DQFurtherInformation'];
  } else {
    delete responseBody.data['respondent2'];
  }
  return responseBody;
};

const isDifferentSolicitorForDefendantResponseOrExtensionDate = () => {
  return mpScenario === 'ONE_V_TWO_TWO_LEGAL_REP' && (eventName === 'DEFENDANT_RESPONSE' || eventName === 'INFORM_AGREED_EXTENSION_DATE');
};
