/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, civilCaseReferenceAfterSDO, gaCaseReference;
const genAppType = 'STAY_THE_CLAIM';
const claimAmountJudge = '11000';

Feature('GA 1v1 Consent Order API tests');

BeforeSuite(async ({api}) => {
 /* civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'SoleTrader');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);*/


  civilCaseReferenceAfterSDO =await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReferenceAfterSDO);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReferenceAfterSDO);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReferenceAfterSDO, true);
  console.log('Civil Case After SDO created for general application: ' + civilCaseReferenceAfterSDO);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  console.log('Civil Case After SDO defendant responded: ' + civilCaseReferenceAfterSDO);
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case After SDO claimant responded: ' + civilCaseReferenceAfterSDO);
});

Scenario('Caseworker makes decision 1V1 - CONSENT ORDER @api-tests @api-scheduler-test', async ({api}) => {

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['STAY_THE_CLAIM']);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start CaseWorker Approve Consent Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.nbcAdminApproveConsentOrder(config.hearingCenterAdminWithRegionId2, gaCaseReference);
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

Scenario('Judge makes decision 1V1 - CONSENT ORDER - Uncloak Application @api-tests', async ({api}) => {

  console.log('Make a General Application for Consent order');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['STRIKE_OUT']);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

});

Scenario('Legal Advisor decision 1V1 - CONSENT ORDER - Uncloak Application @api-tests', async ({api}) => {

  console.log('Make a General Application for Consent order');

  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['EXTEND_TIME']);
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

});

Scenario('Judge makes decision 1V1 - CONSENT ORDER - URGENT Uncloak Application @api-tests', async ({api}) => {

  console.log('Make a General Application for Consent order');
  gaCaseReference = await api.initiateConsentUrgentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['STRIKE_OUT']);

  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '+ gaCaseReference + ' ***');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference, true, true);
  }
  console.log('*** End Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

});

Scenario('After SDO - CONSENT ORDER -  CaseWorker Refer to Judge makes decision 1V1 - Uncloak Application @api-tests', async ({api, I}) => {

  console.log('Make a Urgent General Application for Consent order');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['STAY_THE_CLAIM']);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    console.log('*** NBC Admin Region1 Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminWithRegionId2, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  } else {
    console.log('*** NBC local Admin Region Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminLocal, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  }

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
      await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);
    } else {
      await api.judgeRequestMoreInformationUncloak(config.judgeUserWithRegionId1, gaCaseReference, true, true);
    }

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser,gaCaseReference , 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

});

Scenario('After SDO - CONSENT ORDER - CaseWorker Refer to Judge makes decision 1V1 -- URGENT - Uncloak Application @api-tests', async ({api, I}) => {

  console.log('Make a Urgent General Application for Consent order');
  gaCaseReference = await api.initiateConsentUrgentGeneralApplication(config.applicantSolicitorUser, civilCaseReferenceAfterSDO, ['STAY_THE_CLAIM']);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    console.log('*** NBC Admin Region1 Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminWithRegionId2, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  } else {
    console.log('*** NBC local Admin Region Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.hearingCenterAdminLocal, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');
  }

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeRequestMoreInformationUncloak(config.judgeUser2WithRegionId2, gaCaseReference, true, true);
  } else {
    await api.judgeRequestMoreInformationUncloak(config.judgeUserWithRegionId1, gaCaseReference, true, true);
  }

  console.log('*** Start Callback for Additional Payment: ' + gaCaseReference + ' ***');
  await api.additionalPaymentSuccess(config.applicantSolicitorUser, gaCaseReference, 'APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
  console.log('*** End uncloaking consent order: ' + gaCaseReference + ' ***');

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseConsentOrderApp(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

