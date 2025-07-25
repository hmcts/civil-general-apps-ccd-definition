/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_SAME_SOL';

let civilCaseReference, gaCaseReference;

Feature('Spec 1v2 - General Application after SDO Journey @api-nightly');

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
    await api.judgeMakesDecisionOrderMade(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesDecisionOrderMade(config.judgeUserWithRegionId1, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminWithRegionId2, gaCaseReference);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
  }

  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'HEARING_SCHEDULED');

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakeFinalOrder(config.judgeUser2WithRegionId2, gaCaseReference, 'ASSISTED_ORDER', true);
  } else {
    await api.judgeMakeFinalOrder(config.judgeLocalUser, gaCaseReference, 'ASSISTED_ORDER', true);
  }
}).retry(1);

Scenario('Spec Claimant create GA - CASE_PROGRESSION state', async ({api, I}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'JUDICIAL_REFERRAL');
  await I.wait(10);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Create SDO');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.createSDO(civilCaseReference, config.judgeUser2WithRegionId2, 'CREATE_FAST');
  } else {
    await api.createSDO(civilCaseReference, config.judgeUserWithRegionId1Local, 'CREATE_FAST');
  }
  await I.wait(10);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.scheduleCivilHearing(civilCaseReference, config.hearingCenterAdminWithRegionId2, 'FAST_TRACK_TRIAL');
  } else {
    await api.scheduleCivilHearing(civilCaseReference, config.hearingCenterAdminLocal, 'FAST_TRACK_TRIAL');
  }
  await api.amendHearingDueDate(civilCaseReference, config.systemUpdate);
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingFeePaid(civilCaseReference, config.hearingCenterAdminWithRegionId2);
    await api.createFinalOrder(civilCaseReference, config.judgeUser2WithRegionId2, 'FREE_FORM_ORDER');
  } else {
    await api.hearingFeePaid(civilCaseReference, config.hearingCenterAdminLocal);
    await api.createFinalOrder(civilCaseReference, config.judgeUserWithRegionId1Local, 'FREE_FORM_ORDER');
  }
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionWrittenRep(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesDecisionWrittenRep(config.judgeUserWithRegionId1Local, gaCaseReference);
  }
  await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'AWAITING_WRITTEN_REPRESENTATIONS');
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
