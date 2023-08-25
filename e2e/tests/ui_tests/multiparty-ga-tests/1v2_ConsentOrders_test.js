/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
let civilCaseReference, gaCaseReference, user;

Feature('Before SDO 1v2 - GA - Consent Orders @ui-nightly @regression2');

Scenario('NBC admin Approve Consent Order @e2e-tests', async ({I, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateConsentGeneralApplication(config.secondDefendantSolicitorUser,
    civilCaseReference, false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentConsentResponse1v2(config.applicantSolicitorUser,
    config.defendantSolicitorUser, gaCaseReference, false);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  if (config.runWAApiTest || ['demo'].includes(config.runningEnv)) {
    await api.retrieveTaskDetails(config.nbcAdminWithRegionId4, gaCaseReference, config.waTaskIds.nbcUserReviewGA);
  } else {
    console.log('WA flag is not enabled');
    return;
  }

  console.log('NBC admin Approves Consent order' + gaCaseReference);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    user = config.nbcAdminWithRegionId4;
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
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
