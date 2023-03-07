/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const events = require('../../../fixtures/ga-ccd/events.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

const listForHearingStatus = 'Listed for a Hearing';
const hnStatus = events.HEARING_SCHEDULED_GA.name;
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const claimAmountJudge = '11000';
let civilCaseReference, gaCaseReference;

Feature('After SDO 1v2 - GA CP - Hearing Notice document @ui-nightly');

Scenario('Claimant Hearing notice - Without notice journey @e2e-tests', async ({api_sdo, api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser,
    mpScenario, 'SoleTrader', claimAmountJudge);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.defendantResponseClaim(config.secondDefendantSolicitorUser, mpScenario, 'solicitorTwo');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  await I.wait(10);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Create SDO');
  await api_sdo.createSDO(civilCaseReference, config.judgeUserWithRegionId1, 'CREATE_SMALL');
  await I.wait(10);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearingInPerson(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearingInPerson(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, 'LISTING_FOR_A_HEARING');

  console.log('Hearing Notice creation');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.hearingCenterAdminWithRegionId1);
  } else {
    await I.login(config.hearingCenterAdminLocal);
  }

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(listForHearingStatus);
  await I.navigateToHearingNoticePage(gaCaseReference);
  await I.fillHearingNotice(gaCaseReference, 'claimant', 'default', 'IN_PERSON');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'HEARING_SCHEDULED', config.hearingCenterAdminWithRegionId1);
  console.log('After SDO Hearing Notice created for: ' + gaCaseReference);
  await I.click('Close and Return to case details');
  await I.verifyApplicationDocument('Hearing Notice');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(hnStatus);
  await I.verifyClaimDocument('After SDO - Hearing Notice');

  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyClaimDocument('After SDO - Hearing Notice');
  await I.navigateToCaseDetails(gaCaseReference);
  await I.verifyApplicationDocument('Hearing Notice');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyHearingNoticeDocNotAvailable();

  await I.login(config.secondDefendantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyHearingNoticeDocNotAvailable();

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.assertGaAppCollectionVisiblityToUser(config.hearingCenterAdminWithRegionId1, civilCaseReference, gaCaseReference, 'Y');
    await api.assertGaAppCollectionVisiblityToUser(config.judgeUserWithRegionId1, civilCaseReference, gaCaseReference, 'Y');
  } else {
    await api.assertGaAppCollectionVisiblityToUser(config.hearingCenterAdminLocal, civilCaseReference, gaCaseReference, 'Y');
    await api.assertGaAppCollectionVisiblityToUser(config.judgeLocalUser, civilCaseReference, gaCaseReference, 'Y');
  }

  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, null);
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser, civilCaseReference, gaCaseReference, null);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
