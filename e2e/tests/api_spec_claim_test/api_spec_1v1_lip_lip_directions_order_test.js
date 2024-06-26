/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const { assert } = require('chai');
let civilCaseReference;
const { createAccount, deleteAccount } = require('../../api/idamHelper.js');

Feature('Create Lip v Lip claim -  Default Judgment @api-cui');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario('Spec Claimant create GA with single application type', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  console.log(civilCaseReference);
  const { gaCaseState } = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference);
  assert.equal(gaCaseState, 'AWAITING_APPLICATION_PAYMENT');
});

Scenario('Spec Claimant create GA with multiple application types', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  const { gaCaseState } = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, 'multiple');
  assert.equal(gaCaseState, 'AWAITING_APPLICATION_PAYMENT');
});

AfterSuite(async ({ api }) => {
  await api.cleanUp();
  await deleteAccount(config.defendantCitizenUser2.email);
});