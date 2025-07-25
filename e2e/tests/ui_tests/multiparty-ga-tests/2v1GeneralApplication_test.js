/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const { waitForGACamundaEventsFinishedBusinessProcess } = require('../../../api/testingSupport');
const { getAppTypes } = require('../../../pages/generalApplication/generalApplicationTypes');
const states = require('../../../fixtures/ga-ccd/state.js');

const mpScenario = 'TWO_V_ONE';
const judgeDecisionStatus = states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.name;
const writtenRepStatus = states.AWAITING_WRITTEN_REPRESENTATIONS.name;
const claimantType = 'Company';
const awaitingPaymentStatus = states.AWAITING_APPLICATION_PAYMENT.name;
let civilCaseReference, gaCaseReference, user;

Feature('GA CCD 2v1 - General Application Journey @multiparty-e2e-tests @ui-nightly @regression');

Scenario(
  'GA for 2v1 - Concurrent written representations - without notice to with notice journey',
  async ({ I, api }) => {
    civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
    await api.amendClaimDocuments(config.applicantSolicitorUser);
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Case created for general application: ' + civilCaseReference);
    await I.login(config.applicantSolicitorUser);
    await I.createGeneralApplication(
      getAppTypes().slice(0, 4),
      civilCaseReference,
      'no',
      'no',
      'no',
      'yes',
      'yes',
      'no',
      'signLanguageInterpreter'
    );
    console.log('General Application created: ' + civilCaseReference);
    gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, civilCaseReference);
    await waitForGACamundaEventsFinishedBusinessProcess(
      gaCaseReference,
      states.AWAITING_APPLICATION_PAYMENT.id,
      config.applicantSolicitorUser
    );
    await I.clickAndVerifyTab(civilCaseReference, 'Applications', getAppTypes().slice(0, 4), 1);
    await I.see(awaitingPaymentStatus);
    await I.payAndVerifyGAStatus(
      civilCaseReference,
      gaCaseReference,
      states.APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION.id,
      config.applicantSolicitorUser,
      judgeDecisionStatus
    );

    console.log('Judge Making decision:' + gaCaseReference);
    user = config.judgeUser2WithRegionId2;
    await I.login(user);
    await I.judgeWrittenRepresentationsDecision(
      'orderForWrittenRepresentations',
      'concurrentRep',
      gaCaseReference,
      'withOutNotice',
      'Order_Written_Representation_Concurrent',
      'courtOwnInitiativeOrder'
    );

    await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);

    console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
    await api.additionalPaymentSuccess(
      config.applicantSolicitorUser,
      gaCaseReference,
      states.AWAITING_RESPONDENT_RESPONSE.id
    );
    console.log('*** End Callback for Additional Payment on GA Case Reference: ' + gaCaseReference + ' ***');

    console.log(
      '*** Start Respondent respond to Judge Additional information on GA Case Reference: ' + gaCaseReference + ' ***'
    );
    await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
    console.log(
      '*** End Respondent respond to Judge Additional information on GA Case Reference: ' + gaCaseReference + ' ***'
    );

    await I.signOut();
    await I.login(config.judgeUser2WithRegionId2);
    
    await I.judgeWrittenRepresentationsDecision(
      'orderForWrittenRepresentations',
      'concurrentRep',
      gaCaseReference,
      'no',
      'Order_Written_Representation_Concurrent',
      'withoutNoticeOrder'
    );
    await waitForGACamundaEventsFinishedBusinessProcess(
      gaCaseReference,
      states.AWAITING_WRITTEN_REPRESENTATIONS.id,
      config.applicantSolicitorUser
    );
    await I.judgeCloseAndReturnToCaseDetails();
    await I.verifyJudgesSummaryPage('Concurrent representations', 'no', 'Claimant');
    await I.verifyUploadedApplicationDocument(gaCaseReference, 'Written representation concurrent');
    console.log('Judges made an order for Concurrent written representations on case: ' + gaCaseReference);

    await I.login(config.applicantSolicitorUser);
    await I.navigateToTab(civilCaseReference, 'Applications');
    await I.see(writtenRepStatus);
    await I.respondToJudgesWrittenRep(gaCaseReference, 'Written representation concurrent document');
    console.log('Responded to Judges written representations on case: ' + gaCaseReference);
    await api.verifyGAState(
      config.defendantSolicitorUser,
      civilCaseReference,
      gaCaseReference,
      states.AWAITING_WRITTEN_REPRESENTATIONS.id
    );

    await I.verifyCaseFileAppDocument(civilCaseReference, 'Concurrent order document');
  }
).retry(1);

AfterSuite(async ({ api }) => {
  await api.cleanUp();
});
