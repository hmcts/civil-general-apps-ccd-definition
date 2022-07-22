const config = require('../config.js');
const lodash = require('lodash');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');

chai.use(deepEqualInAnyOrder);
chai.config.truncateThreshold = 0;
const {expect, assert} = chai;

const {waitForFinishedBusinessProcess, waitForGAFinishedBusinessProcess, waitForGACamundaEventsFinishedBusinessProcess, assignCaseToDefendant} = require('../api/testingSupport');
const {assignCaseRoleToUser, addUserCaseMapping, unAssignAllUsers} = require('./caseRoleAssignmentHelper');
const apiRequest = require('./apiRequest.js');
const claimData = require('../fixtures/events/createClaim.js');
const claimSpecData = require('../fixtures/events/createClaimSpec.js');
const genAppData = require('../fixtures/ga-ccd/createGeneralApplication.js');
const genAppRespondentResponseData = require('../fixtures/ga-ccd/respondentResponse.js');
const genAppJudgeMakeDecisionData = require('../fixtures/ga-ccd/judgeMakeDecision.js');
const events = require('../fixtures/ga-ccd/events.js');

const expectedEvents = require('../fixtures/ccd/expectedEvents.js');
const testingSupport = require('./testingSupport');

const data = {
  INITIATE_GENERAL_APPLICATION: genAppData.createGAData(),
  RESPOND_TO_APPLICATION: genAppRespondentResponseData.respondGAData(),
  JUDGE_MAKES_DECISION: genAppJudgeMakeDecisionData.judgeMakesDecisionData(),
  JUDGE_MAKES_ORDER_WRITTEN_REP: genAppJudgeMakeDecisionData.judgeMakeOrderWrittenRep(),
  RESPOND_TO_JUDGE_ADDITIONAL_INFO: genAppRespondentResponseData.toJudgeAdditionalInfo(),
  RESPOND_TO_JUDGE_DIRECTIONS: genAppRespondentResponseData.toJudgeDirectionsOrders(),
  RESPOND_TO_JUDGE_WRITTEN_REPRESENTATION:genAppRespondentResponseData.toJudgeWrittenRepresentation(),
  JUDGE_MAKES_ORDER_DIRECTIONS_REP: genAppJudgeMakeDecisionData.judgeMakeDecisionDirectionOrder(),
  LIST_FOR_A_HEARING: genAppJudgeMakeDecisionData.listingForHearing(),
  APPLICATION_DISMISSED: genAppJudgeMakeDecisionData.applicationsDismiss(),
  CREATE_CLAIM: (mpScenario) => claimData.createClaim(mpScenario),
  CREATE_SPEC_CLAIM: (mpScenario) => claimSpecData.createClaim(mpScenario),
  CREATE_CLAIM_RESPONDENT_LIP: claimData.createClaimLitigantInPerson,
  CREATE_CLAIM_TERMINATED_PBA: claimData.createClaimWithTerminatedPBAAccount,
  CREATE_CLAIM_RESPONDENT_SOLICITOR_FIRM_NOT_IN_MY_HMCTS: claimData.createClaimRespondentSolFirmNotInMyHmcts,
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
  DEFENDANT_RESPONSE_SAME_SOLICITOR:  require('../fixtures/events/1v2SameSolicitorEvents/defendantResponse_sameSolicitor.js'),
  DEFENDANT_RESPONSE_SOLICITOR_ONE:  require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor1'),
  DEFENDANT_RESPONSE_SOLICITOR_TWO:  require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor2'),
  DEFENDANT_RESPONSE_TWO_APPLICANTS:  require('../fixtures/events/2v1Events/defendantResponse_2v1'),
  CLAIMANT_RESPONSE: require('../fixtures/events/claimantResponse.js'),
  ADD_DEFENDANT_LITIGATION_FRIEND: require('../fixtures/events/addDefendantLitigationFriend.js'),
  CASE_PROCEEDS_IN_CASEMAN: require('../fixtures/events/caseProceedsInCaseman.js'),
  AMEND_PARTY_DETAILS: require('../fixtures/events/amendPartyDetails.js'),
  ADD_CASE_NOTE: require('../fixtures/events/addCaseNote.js')
};

const eventData = {
  acknowledgeClaim: {
    ONE_V_ONE: data.ACKNOWLEDGE_CLAIM,
    ONE_V_TWO_ONE_LEGAL_REP: data.ACKNOWLEDGE_CLAIM_SAME_SOLICITOR,
    ONE_V_TWO_TWO_LEGAL_REP: {
      solicitorOne: data.ACKNOWLEDGE_CLAIM_SOLICITOR_ONE,
      solicitorTwo: data.ACKNOWLEDGE_CLAIM_SOLICITOR_TWO
    },
    TWO_V_ONE: data.ACKNOWLEDGE_CLAIM
  },
  defendantResponse:{
    ONE_V_ONE: data.DEFENDANT_RESPONSE,
    ONE_V_TWO_ONE_LEGAL_REP: data.DEFENDANT_RESPONSE_SAME_SOLICITOR,
    ONE_V_TWO_TWO_LEGAL_REP: {
      solicitorOne: data.DEFENDANT_RESPONSE_SOLICITOR_ONE,
      solicitorTwo: data.DEFENDANT_RESPONSE_SOLICITOR_TWO
    },
    TWO_V_ONE: data.DEFENDANT_RESPONSE_TWO_APPLICANTS
  }
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
    console.log('*** GA Case Reference: '  + gaCaseReference + ' ***');

    return gaCaseReference;
  },

  getGACaseReference: async (user, parentCaseId) => {
    eventName = events.INITIATE_GENERAL_APPLICATION.id;

    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, parentCaseId);
    const updatedResponse = await apiRequest.fetchUpdatedCaseData(parentCaseId);
    const updatedCivilCaseData = await updatedResponse.json();
    let gaCaseReference = updatedCivilCaseData.generalApplicationsDetails[0].value.caseLink.CaseReference;
    console.log('*** GA Case Reference: '  + gaCaseReference + ' ***');

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

  judgeMakesDecisionAdditionalInformation: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.JUDGE_MAKES_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_DECISION, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, '# You have requested more information');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_ADDITIONAL_INFORMATION');
  },

  judgeMakesDecisionApplicationDismiss: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.JUDGE_MAKES_DECISION.id;

    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_DISMISS, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_DISMISSED');
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
    eventName = events.JUDGE_MAKES_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_WRITTEN_REP, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_WRITTEN_REPRESENTATIONS');
  },

  judgeMakesDecisionDirectionsOrder: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.JUDGE_MAKES_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.JUDGE_MAKES_ORDER_DIRECTIONS_REP, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'AWAITING_DIRECTIONS_ORDER_DOCS');
  },
  judgeListApplicationForHearing: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.JUDGE_MAKES_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.LIST_FOR_A_HEARING, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'LISTING_FOR_A_HEARING');
  },
  judgeDismissApplication: async (user, gaCaseId) => {
    await apiRequest.setupTokens(user);
    eventName = events.JUDGE_MAKES_DECISION.id;
    await apiRequest.startGAEvent(eventName, gaCaseId);

    const response = await apiRequest.submitGAEvent(eventName, data.APPLICATION_DISMISSED, gaCaseId);
    const responseBody = await response.json();

    assert.equal(response.status, 201);
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, 'Your order has been made');

    await waitForGACamundaEventsFinishedBusinessProcess(gaCaseId, 'JUDGE_MAKES_DECISION');

    const updatedBusinessProcess = await apiRequest.fetchUpdatedGABusinessProcessData(gaCaseId);
    const updatedGABusinessProcessData = await updatedBusinessProcess.json();
    assert.equal(updatedGABusinessProcessData.ccdState, 'APPLICATION_DISMISSED');
  },
  createClaimWithRespondentLitigantInPerson: async (user) => {
    eventName = 'CREATE_CLAIM';
    caseId = null;
    caseData = {};
    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName);
    await validateEventPages(data.CREATE_CLAIM_RESPONDENT_LIP);

    await assertSubmittedEvent('PENDING_CASE_ISSUED', {
      header: 'Your claim has been received and will progress offline',
      body: 'Your claim will not be issued until payment is confirmed. Once payment is confirmed you will receive an email. The claim will then progress offline.'
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
  },

  createClaimWithRespondentSolicitorFirmNotInMyHmcts: async (user) => {
    eventName = 'CREATE_CLAIM';
    caseId = null;
    caseData = {};
    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName);
    await validateEventPages(data.CREATE_CLAIM_RESPONDENT_SOLICITOR_FIRM_NOT_IN_MY_HMCTS);

    await assertSubmittedEvent('PENDING_CASE_ISSUED', {
      header: 'Your claim has been received and will progress offline',
      body: 'Your claim will not be issued until payment is confirmed. Once payment is confirmed you will receive an email. The claim will then progress offline.'
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    //field is deleted in about to submit callback
    deleteCaseFields('applicantSolicitor1CheckEmail');
  },

  createClaimWithFailingPBAAccount: async (user) => {
    eventName = 'CREATE_CLAIM';
    caseId = null;
    caseData = {};
    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName);
    await validateEventPages(data.CREATE_CLAIM_TERMINATED_PBA);
    await assertSubmittedEvent('PENDING_CASE_ISSUED', {
      header: 'Your claim has been received',
      body: 'You have until DATE to notify the defendant of the claim and claim details.'
    });

    await assignCaseToDefendant(caseId);
    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'PENDING_CASE_ISSUED');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PENDING_CASE_ISSUED');
    // await assertCaseNotAvailableToUser(config.defendantSolicitorUser);
  },

  resubmitClaim: async (user) => {
    eventName = 'RESUBMIT_CLAIM';
    caseData = {};
    await apiRequest.setupTokens(user);
    await apiRequest.startEvent(eventName, caseId);
    await validateEventPages(data.RESUBMIT_CLAIM);
    await assertSubmittedEvent('PENDING_CASE_ISSUED', {
      header: 'Claim pending',
      body: 'Your claim will be processed. Wait for us to contact you.'
    });
    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'CASE_ISSUED');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PENDING_CASE_ISSUED');
    // await assertCaseNotAvailableToUser(config.defendantSolicitorUser);
  },

  amendClaimDocuments: async (user) => {
    // Temporary work around from CMC-1497 - statement of truth field is removed due to callback code in service repo.
    // Currently the mid event sets uiStatementOfTruth to null. When EXUI is involved this has the appearance of
    // resetting the field in the UI, most likely due to some caching mechanism, but the data is still available for the
    // about to submit. As these tests talk directly to the data store API the field is actually removed in the about
    // to submit callback. This gives the situation where uiStatementOfTruth is a defined field but with internal fields
    // set to null. In the about to submit callback this overwrites applicantSolicitor1ClaimStatementOfTruth with null
    // fields. When data is fetched here, the field does not exist.
    deleteCaseFields('applicantSolicitor1ClaimStatementOfTruth');

    await apiRequest.setupTokens(user);

    eventName = 'ADD_OR_AMEND_CLAIM_DOCUMENTS';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    await validateEventPages(data[eventName]);

    const document = await testingSupport.uploadDocument();
    let errorData = await updateCaseDataWithPlaceholders(data[eventName], document);

    await assertError('Upload', errorData.invalid.Upload.duplicateError,
      'You need to either upload 1 Particulars of claim only or enter the Particulars of claim text in the field provided. You cannot do both.');

    await assertSubmittedEvent('CASE_ISSUED', {
      header: 'Documents uploaded successfully',
      body: ''
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'CASE_ISSUED');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'CASE_ISSUED');
    // await assertCaseNotAvailableToUser(config.defendantSolicitorUser);
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

  amendPartyDetails: async (user) => {
    await apiRequest.setupTokens(user);

    eventName = 'AMEND_PARTY_DETAILS';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);

    await validateEventPages(data[eventName]);

    await assertSubmittedEvent('AWAITING_RESPONDENT_ACKNOWLEDGEMENT', {
      header: 'You have updated a legal representative\'s email address',
      body: ' '
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
  },

  acknowledgeClaim: async (user, multipartyScenario, solicitor) => {
    mpScenario = multipartyScenario;
    await apiRequest.setupTokens(user);

    eventName = 'ACKNOWLEDGE_CLAIM';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);

    solicitorSetup(solicitor);

    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    deleteCaseFields('systemGeneratedCaseDocuments');
    deleteCaseFields('solicitorReferences');
    deleteCaseFields('solicitorReferencesCopy');
    deleteCaseFields('respondentSolicitor2Reference');

    // solicitor 2 should not be able to see respondent 1 details
    if (solicitor === 'solicitorTwo'){
      deleteCaseFields('respondent1ClaimResponseIntentionType');
    }

    if(mpScenario !== 'ONE_V_TWO_TWO_LEGAL_REP') {
      await validateEventPages(eventData['acknowledgeClaim'][mpScenario]);
    } else {
      await validateEventPages(eventData['acknowledgeClaim'][mpScenario][solicitor]);
    }

    await assertError('ConfirmNameAddress', data[eventName].invalid.ConfirmDetails.futureDateOfBirth,
      'The date entered cannot be in the future');

    await assertSubmittedEvent('AWAITING_RESPONDENT_ACKNOWLEDGEMENT', {
      header: '',
      body: ''
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');

    //removed because it's not needed for the further tests
    deleteCaseFields('respondent1Copy');
    deleteCaseFields('respondent2Copy');
    deleteCaseFields('solicitorReferencesCopy');
  },

  informAgreedExtension: async (user, multipartyScenario, solicitor) => {
    mpScenario = multipartyScenario;
    await apiRequest.setupTokens(user);

    solicitorSetup(solicitor);

    eventName = 'INFORM_AGREED_EXTENSION_DATE';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;
    deleteCaseFields('systemGeneratedCaseDocuments');

    await validateEventPages(data[eventName], solicitor);

    await assertError('ExtensionDate', data[eventName].invalid.ExtensionDate.past,
      'The agreed extension date must be a date in the future');
    await assertError('ExtensionDate', data[eventName].invalid.ExtensionDate.beforeCurrentDeadline,
      'The agreed extension date must be after the current deadline');

    await assertSubmittedEvent('AWAITING_RESPONDENT_ACKNOWLEDGEMENT', {
      header: 'Extension deadline submitted',
      body: 'You must respond to the claimant by'
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    deleteCaseFields('isRespondent1');
  },

  defendantResponse: async (user, multipartyScenario, solicitor) => {
    await apiRequest.setupTokens(user);
    mpScenario = multipartyScenario;
    eventName = 'DEFENDANT_RESPONSE';

    // solicitor 2 should not see respondent 1 data but because respondent 1 has replied before this, we need
    // to clear a big chunk of defendant response (respondent 1) data hence its cleaner to have a clean slate
    // and start off from there.
    if(solicitor === 'solicitorTwo'){
      caseData = {};
    }

    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);

    solicitorSetup(solicitor);

    let defendantResponseData;
    if(mpScenario !== 'ONE_V_TWO_TWO_LEGAL_REP') {
      defendantResponseData = eventData['defendantResponse'][mpScenario];
    } else {
      defendantResponseData = eventData['defendantResponse'][mpScenario][solicitor];
    }

    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    deleteCaseFields('isRespondent1');
    deleteCaseFields('respondent1', 'solicitorReferences');
    deleteCaseFields('systemGeneratedCaseDocuments');
    //this is for 1v2 diff sol 1
    deleteCaseFields('respondentSolicitor2Reference');

    await validateEventPages(defendantResponseData, solicitor);

    await assertError('ConfirmDetails', defendantResponseData.invalid.ConfirmDetails.futureDateOfBirth,
      'The date entered cannot be in the future');
    await assertError('Experts', defendantResponseData.invalid.Experts.emptyDetails, 'Expert details required');
    await assertError('Hearing', defendantResponseData.invalid.Hearing.past,
      'The date cannot be in the past and must not be more than a year in the future');
    await assertError('Hearing', defendantResponseData.invalid.Hearing.moreThanYear,
      'The date cannot be in the past and must not be more than a year in the future');

    // In a 1v2 different solicitor case, when the first solicitor responds, civil service would not change the state
    // to AWAITING_APPLICANT_INTENTION until the all solicitor response.
    if(solicitor === 'solicitorOne'){
      // when only one solicitor has responded in a 1v2 different solicitor case
      await assertSubmittedEvent('AWAITING_RESPONDENT_ACKNOWLEDGEMENT', {
        header: 'You have submitted the Defendant\'s defence',
        body: 'Once the other defendant\'s legal representative has submitted their defence, we will send the '
          + 'claimant\'s legal representative a notification.'
      });

      await waitForFinishedBusinessProcess(caseId);
      await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
      await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
      await assertCorrectEventsAreAvailableToUser(config.adminUser, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
    } else {
      // when all solicitors responded
      await assertSubmittedEvent('AWAITING_APPLICANT_INTENTION', {
        header: 'You have submitted the Defendant\'s defence',
        body: 'The Claimant legal representative will get a notification'
      });

      await waitForFinishedBusinessProcess(caseId);
      await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'AWAITING_APPLICANT_INTENTION');
      await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'AWAITING_APPLICANT_INTENTION');
      await assertCorrectEventsAreAvailableToUser(config.adminUser, 'AWAITING_APPLICANT_INTENTION');
    }

    deleteCaseFields('respondent1Copy');
    deleteCaseFields('respondent2Copy');
  },

  claimantResponse: async (user) => {
    // workaround
    deleteCaseFields('applicantSolicitor1ClaimStatementOfTruth');
    deleteCaseFields('respondentResponseIsSame');

    await apiRequest.setupTokens(user);

    eventName = 'CLAIMANT_RESPONSE';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    await validateEventPages(data.CLAIMANT_RESPONSE);

    await assertError('Experts', data[eventName].invalid.Experts.emptyDetails, 'Expert details required');
    await assertError('Hearing', data[eventName].invalid.Hearing.past,
      'The date cannot be in the past and must not be more than a year in the future');
    await assertError('Hearing', data[eventName].invalid.Hearing.moreThanYear,
      'The date cannot be in the past and must not be more than a year in the future');

    await assertSubmittedEvent('PROCEEDS_IN_HERITAGE_SYSTEM', {
      header: 'You have chosen to proceed with the claim',
      body: '>We will review the case and contact you to tell you what to do next.'
    });

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
  },

  //TODO this method is not used in api tests
  addDefendantLitigationFriend: async () => {
    eventName = 'ADD_DEFENDANT_LITIGATION_FRIEND';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    await validateEventPages(data.ADD_DEFENDANT_LITIGATION_FRIEND);
    await assertSubmittedEvent('ADD_DEFENDANT_LITIGATION_FRIEND', {
      header: 'You have added litigation friend details',
      body: '<br />'
    });
  },

  moveCaseToCaseman: async (user) => {
    // workaround
    deleteCaseFields('applicantSolicitor1ClaimStatementOfTruth');

    await apiRequest.setupTokens(user);

    eventName = 'CASE_PROCEEDS_IN_CASEMAN';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    await validateEventPages(data.CASE_PROCEEDS_IN_CASEMAN);

    await assertError('CaseProceedsInCaseman', data[eventName].invalid.CaseProceedsInCaseman,
      'The date entered cannot be in the future');

    //TODO CMC-1245 confirmation page for event
    await assertSubmittedEvent('PROCEEDS_IN_HERITAGE_SYSTEM', {
      header: '',
      body: ''
    }, false);

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.defendantSolicitorUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'PROCEEDS_IN_HERITAGE_SYSTEM');
  },

  addCaseNote: async (user) => {
    deleteCaseFields('applicantSolicitor1ClaimStatementOfTruth');

    await apiRequest.setupTokens(user);

    eventName = 'ADD_CASE_NOTE';
    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);
    assertContainsPopulatedFields(returnedCaseData);
    caseData = returnedCaseData;

    await validateEventPages(data.ADD_CASE_NOTE);

    await assertSubmittedEvent('CASE_ISSUED', {
      header: '',
      body: ''
    }, false);

    await waitForFinishedBusinessProcess(caseId);
    await assertCorrectEventsAreAvailableToUser(config.applicantSolicitorUser, 'CASE_ISSUED');
    await assertCorrectEventsAreAvailableToUser(config.adminUser, 'CASE_ISSUED');

    // caseNote is set to null in service
    deleteCaseFields('caseNote');
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
    if (pageId === 'Upload' || pageId === 'DraftDirections'|| pageId === 'ApplicantDefenceResponseDocument' || pageId === 'DraftDirections') {
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

  if(eventName === 'INFORM_AGREED_EXTENSION_DATE' && mpScenario === 'ONE_V_TWO_TWO_LEGAL_REP'){
    responseBody = clearDataForExtensionDate(await response.json(), solicitor);
  } else if (eventName === 'DEFENDANT_RESPONSE' && mpScenario === 'ONE_V_TWO_TWO_LEGAL_REP'){
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

const assertContainsPopulatedFields = returnedCaseData => {
  for (let populatedCaseField of Object.keys(caseData)) {
    assert.property(returnedCaseData,  populatedCaseField);
  }
  };

  // Mid event will not return case fields that were already filled in another event if they're present on currently processed event.
  // This happens until these case fields are set again as a part of current event (note that this data is not removed from the case).
  // Therefore these case fields need to be removed from caseData, as caseData object is used to make assertions
const deleteCaseFields = (...caseFields) => {
  caseFields.forEach(caseField => delete caseData[caseField]);
};

const assertCorrectEventsAreAvailableToUser = async (user, state) => {
  console.log(`Asserting user ${user.type} in env ${config.runningEnv} has correct permissions`);
  const caseForDisplay = await apiRequest.fetchCaseForDisplay(user, caseId);
  if (config.runningEnv === 'preview') {
    expect(caseForDisplay.triggers).to.deep.include.members(expectedEvents[user.type][state]);
  } else {
    expect(caseForDisplay.triggers).to.deep.equalInAnyOrder(expectedEvents[user.type][state]);
  }
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

  if(eventName === 'CREATE_CLAIM'){
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
  switch(mpScenario){
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
  switch(mpScenario){
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

// solicitor 1 should not see details for respondent 2
// solicitor 2 should not see details for respondent 1
const solicitorSetup = (solicitor) => {
  if(solicitor === 'solicitorOne'){
    deleteCaseFields('respondent2');
  } else if (solicitor === 'solicitorTwo'){
    deleteCaseFields('respondent1');
  }
};

const clearDataForExtensionDate = (responseBody, solicitor) => {
  delete responseBody.data['businessProcess'];
  delete responseBody.data['caseNotes'];
  delete responseBody.data['systemGeneratedCaseDocuments'];

  // solicitor cannot see data from respondent they do not represent
  if(solicitor === 'solicitorTwo'){
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
  if(solicitor === 'solicitorTwo'){
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
