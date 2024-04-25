/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_ONE';
let civilCaseReference, gaCaseReference, user;
const claimAmountJudge = '11000';

Feature('Before SDO 1v2 - GA - Consent Orders @ui-nightly');

Scenario.skip('NBC admin Approve Consent Order @e2e-tests', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser,
    mpScenario, 'SoleTrader', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.secondDefendantSolicitorUser,
    civilCaseReference, ['STAY_THE_CLAIM'],false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentConsentResponse1v2(config.applicantSolicitorUser,
    config.defendantSolicitorUser, gaCaseReference, true);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  if (config.runWAApiTest || ['demo'].includes(config.runningEnv)) {
    await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId2, gaCaseReference, config.waTaskIds.nbcUserReviewGA);
  } else {
    console.log('WA flag is not enabled');
    return;
  }

  console.log('NBC admin Approves Consent order' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.hearingCenterAdminWithRegionId2;
    await I.login(user);
  } else {
    user = config.nbcAdminWithRegionId4;
    await I.login(user);
  }

  await I.approveConsentOrder(gaCaseReference);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.ORDER_MADE.id, user);
  await I.verifyUploadedApplicationDocument(gaCaseReference, 'Consent Order');

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.ORDER_MADE.name);

  await I.verifyUploadedClaimDocument(civilCaseReference, 'Consent order document');

  await I.verifyCaseFileOrderDocument(civilCaseReference, 'Consent Order');
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Consent Order');
}).retry(1);

Scenario.only('GA 1v1  - General Application LR vs LIP 1V1 @e2e-tests', async ({api, I}) => {

  civilCaseReference = await api.createClaimWithRespondentLitigantInPerson(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimLip(config.applicantSolicitorUser);
  await api.notifyClaimDetailsLip(config.applicantSolicitorUser, mpScenario);

  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
});

AfterSuite(async ({api}) => {
  //await api.cleanUp();
});
