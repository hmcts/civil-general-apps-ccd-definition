/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;
const genAppType = 'STAY_THE_CLAIM';
const claimAmountJudge = '11000';

Feature('GA 1v1 Caseworker Approve Consent Order API tests');

Scenario('caseworker makes decision 1V1 - CONSENT ORDER @api-testsssss @api-scheduler-test', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReference, false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start CaseWorker Approve Consent Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.nbcAdminApproveConsentOrder(config.nbcAdminWithRegionId4, gaCaseReference);
  } else {
    await api.nbcAdminApproveConsentOrder(config.hearingCenterAdminLocal, gaCaseReference);
  }
  console.log('*** End CaseWorker Approve Consent Order on GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge Revisit 1V1 - consentOrder End Date Scheduler @api-scheduler-test', async ({api}) => {

  console.log('*** Triggering Judge Revisit Order Made Scheduler ***');
  await api.judgeRevisitConsentScheduler(gaCaseReference, 'ORDER_MADE', genAppType);
  console.log('*** End of Judge Revisit Order Made Scheduler ***');

});

Scenario('Judge makes decision 1V1 - CONSENT ORDER - Uncloak Application @api-testsssss', async ({api}) => {

  console.log('Make a General Application for Consent order');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

});

Scenario.only('Judge makes decision 1V1 - CONSENT ORDER - URGENT Uncloak Application @api-testsssss', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application for Consent order');
  gaCaseReference = await api.initiateUrgentConsentGaForReview(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** NBC Admin Region4 Refer to Judge Process Start ***');
  await api.nbcAdminReferToJudge(config.nbcAdminWithRegionId4, gaCaseReference);
  console.log('*** NBC Admin Region4 Refer to Judge Process End ***');

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '+ gaCaseReference + ' ***');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

});

Scenario('After SDO- Judge makes decision 1V1 - CONSENT ORDER - Uncloak Application @api-testsssss', async ({api, I}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');

  console.log('Make a Urgent General Application for Consent order');
  gaCaseReference = await api.initiateConsentGaForReview(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    console.log('*** NBC Admin Region1 Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminWithRegionId1, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  } else {
    console.log('*** NBC local Admin Region Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminLocal, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  }

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeRequestMoreInformationUncloak(config.judgeUserWithRegionId1, gaCaseReference, true, true);
    } else {
      await api.judgeRequestMoreInformationUncloak(config.judgeUserWithRegionId1, gaCaseReference, true, true);
    }

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser,gaCaseReference , 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

});

Scenario('After SDO- Judge makes decision 1V1 - CONSENT ORDER -- URGENT - Uncloak Application @api-tests', async ({api, I}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');

  console.log('Make a Urgent General Application for Consent order');
  gaCaseReference = await api.initiateUrgentConsentGaForReview(config.applicantSolicitorUser, civilCaseReference);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    console.log('*** NBC Admin Region1 Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminWithRegionId1, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  } else {
    console.log('*** NBC local Admin Region Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminLocal, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  }

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'AWAITING_RESPONDENT_ACKNOWLEDGEMENT');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

