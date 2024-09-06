/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const { assert } = require('chai');
let civilCaseReference, gaCaseReference;
const { createAccount, deleteAccount } = require('../../api/idamHelper.js');

Feature('Create Lip v Lip claim -  Default Judgment @api-cui');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario('Spec Claimant create GA with single application type and HWF', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  console.log(civilCaseReference);
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, '', true, true);
});

Scenario('Spec Claimant create GA with multiple application types', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, 'multiple', false, false);
});

Scenario.only('Spec Claimant create GA without notice', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, '', false, false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
              + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesOrderDecisionUncloak(config.judgeUser2WithRegionId2, gaCaseReference);
  } else {
    await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
  }
});

Scenario.only('Spec Claimant create GA without notice', async ({ api }) => {
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

AfterSuite(async ({ api }) => {
  await api.cleanUp();
  await deleteAccount(config.defendantCitizenUser2.email);
});
