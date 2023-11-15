/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const states = require('../../fixtures/ga-ccd/state');
const mpScenario = 'ONE_V_TWO_SAME_SOL';
const hnStateStatus = states.HEARING_SCHEDULED.id;

let civilCaseReference, gaCaseReference;

Feature('Spec 1v2 - General Application after SDO Journey @api-tests');

Scenario('Spec Claimant create GA - JUDICIAL_REFERRAL state', async ({api}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminWithRegionId1, gaCaseReference);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
  }

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'HEARING_SCHEDULED');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakeFinalOrder(config.judgeUserWithRegionId1, gaCaseReference, 'ASSISTED_ORDER', true);
  } else {
    await api.judgeMakeFinalOrder(config.judgeLocalUser, gaCaseReference, 'ASSISTED_ORDER', true);
  }
});

Scenario('Spec Claimant create GA - CASE_PROGRESSION state @123', async ({api, I}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'JUDICIAL_REFERRAL');
  await I.wait(10);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Create SDO');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.createSDO(civilCaseReference, config.judgeUserWithRegionId1, 'CREATE_FAST');
  } else {
    await api.createSDO(civilCaseReference, config.judgeUserWithRegionId1Local, 'CREATE_FAST');
  }
  await I.wait(10);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.scheduleCivilHearing(civilCaseReference, config.hearingCenterAdminWithRegionId1, 'OTHER');
  } else {
    await api.scheduleCivilHearing(civilCaseReference, config.hearingCenterAdminLocal, 'OTHER');
  }
  await api.amendHearingDueDate(civilCaseReference, config.systemupdate);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingFeePaid(civilCaseReference, config.hearingCenterAdminWithRegionId1);
    await api.createFinalOrder(civilCaseReference, config.judgeUserWithRegionId1, 'FREE_FORM_ORDER');
  } else {
    await api.hearingFeePaid(civilCaseReference, config.hearingCenterAdminLocal);
    await api.createFinalOrder(civilCaseReference, config.judgeUserWithRegionId1Local, 'FREE_FORM_ORDER');
  }

  await I.wait(10);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start Judge makes order application after hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  const doc = 'hearingNotice';
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeUserWithRegionId1, gaCaseReference);
  }
  console.log('*** End Judge makes order application after hearing GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminWithRegionId1, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUserWithRegionId1, civilCaseReference, gaCaseReference, doc);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminWithRegionId1, gaCaseReference);
    await api.assertGaDocumentVisibilityToUser(config.judgeUserWithRegionId1, civilCaseReference, gaCaseReference, doc);
  }

  await api.verifyGAState(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, hnStateStatus);
  await api.assertNullGaDocumentVisibilityToUser(config.applicantSolicitorUser, civilCaseReference, doc);
  await api.assertGaDocumentVisibilityToUser(config.defendantSolicitorUser, civilCaseReference, gaCaseReference, doc);
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});
