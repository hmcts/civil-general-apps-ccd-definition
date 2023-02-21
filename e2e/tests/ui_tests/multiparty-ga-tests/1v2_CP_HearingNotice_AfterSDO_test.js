/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const states = require('../../../fixtures/ga-ccd/state.js');

const hnStateStatus = states.HEARING_SCHEDULED.id;
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');

let civilCaseReference, gaCaseReference;

Feature('After SDO 1v2 - GA CP - Hearing Notice document @ui-nightly');

Scenario('Claimant Hearing notice journey @non-prod-e2e', async ({api_sdo, api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser,
    mpScenario, 'SoleTrader', '11000');
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

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await I.login(config.hearingCenterAdminWithRegionId1);
  } else {
    await I.login(config.hearingCenterAdminLocal);
  }

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.LISTING_FOR_A_HEARING.name);
  await I.navigateToHearingNoticePage(gaCaseReference);
  await I.fillHearingNotice(gaCaseReference, 'claimant', 'default', 'IN_PERSON');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, hnStateStatus, config.hearingCenterAdminWithRegionId1);
  console.log('After SDO Hearing Notice created for: ' + gaCaseReference);
  await I.click('Close and Return to case details');
  await I.verifyApplicationDocument('Hearing Notice');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.HEARING_SCHEDULED.name);
  await I.verifyClaimDocument('After SDO - Hearing Notice');

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
  await api.verifyGAState(config.secondDefendantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
