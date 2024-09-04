/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const { assert } = require('chai');
let civilCaseReference, gaCaseReference;
const { createAccount, deleteAccount } = require('../../api/idamHelper.js');

Feature('Create Lip v Lip claim -  Default Judgment @api-cui @dd');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario('Spec Claimant create GA with single application type and HWF @dd', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  console.log(civilCaseReference);
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, '', true);
});

Scenario('Spec Claimant create GA with multiple application types', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
});

/*AfterSuite(async ({ api }) => {
  await api.cleanUp();
  await deleteAccount(config.defendantCitizenUser2.email);
}); */
