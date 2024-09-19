/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const { assert } = require('chai');
let civilCaseReference, gaCaseReference;
const { createAccount, deleteAccount } = require('../../api/idamHelper.js');

Feature('Create Lip v Lip claim -  Default Judgment @api-neeta');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario.only('Spec Claimant create GA with single application type and HWF', async ({ api }) => {
  //civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  //console.log(civilCaseReference);
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, '1726653366052824', '', false);
});

Scenario('Spec Claimant create GA with multiple application types', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
});

Scenario('Spec Claimant create GA without notice judge make order', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, '', false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
              + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesOrderDecisionUncloak(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
  }
});

Scenario('Spec Claimant create GA without notice', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresentedWithout(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
              + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesOrderDecisionUncloak(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
  }
});

Scenario('Spec Claimant create GA without notice judge make final order', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresentedWithout(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes order application after hearing GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminWithRegionId2, gaCaseReference);
  } else {
    await api.hearingCenterAdminScheduleHearing(config.hearingCenterAdminLocal, gaCaseReference);
  }
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakeFinalOrder(config.judgeUser2WithRegionId2, gaCaseReference, 'FREE_FORM_ORDER', false);
  } else {
    await api.judgeMakeFinalOrder(config.judgeLocalUser, gaCaseReference, 'FREE_FORM_ORDER', false);
  }
});

AfterSuite(async ({ api }) => {
  //await api.cleanUp();
 // await deleteAccount(config.defendantCitizenUser2.email);
});
