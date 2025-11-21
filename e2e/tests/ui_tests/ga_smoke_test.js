/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');
let civilCaseReference, gaCaseReference;
const mpScenario = 'ONE_V_ONE';
const claimAmountJudge = '11000';

Feature('General Application Smoke tests @ga-smoke-tests');

Scenario('GA 1v1  - Judge Makes Decision Order Made @smoke-tests', async ({api, I}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', claimAmountJudge);
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);
  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  await api.judgeMakesDecisionOrderMade(config.judgeUser2WithRegionId2, gaCaseReference);
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see('Order Made');
});

Scenario('Claimant Hearing notice - Without notice journey @smoke-tests', async ({api, I}) => {
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
  await I.wait(10);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.judgeListApplicationForHearingInPerson(config.judgeUser2WithRegionId2, gaCaseReference);
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, states.LISTING_FOR_A_HEARING.id);
  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, states.LISTING_FOR_A_HEARING.id);

  console.log('Hearing Notice creation');
  await I.login(config.hearingCenterAdminWithRegionId2);

  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.LISTING_FOR_A_HEARING.name);
  await I.navigateToHearingNoticePage(gaCaseReference);
  await I.fillHearingNotice(gaCaseReference, 'claimant', 'default', 'IN_PERSON');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.HEARING_SCHEDULED.id, config.hearingCenterAdminWithRegionId2);
  console.log('After SDO Hearing Notice created for: ' + gaCaseReference);
  await I.click('Close and Return to case details');

  await I.verifyUploadedApplicationDocument(gaCaseReference, 'Hearing Notice');
  await I.navigateToApplicationsTab(civilCaseReference);
  await I.see(states.HEARING_SCHEDULED.name);
  await I.verifyUploadedClaimDocument(civilCaseReference, 'After SDO - Hearing Notice');

  await I.login(config.secondDefendantSolicitorUser);
  await I.verifyUploadedClaimDocument(civilCaseReference, 'After SDO - Hearing Notice');
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');

  await I.login(config.defendantSolicitorUser);
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');
  await I.dontSee('Applications', 'div.mat-tab-label-content');

  await I.login(config.applicantSolicitorUser);
  await I.verifyCaseFileAppDocument(civilCaseReference, 'Hearing Notice');
  await I.dontSee('Applications', 'div.mat-tab-label-content');
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
