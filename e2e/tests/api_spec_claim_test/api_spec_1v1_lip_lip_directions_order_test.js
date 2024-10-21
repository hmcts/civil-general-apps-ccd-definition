/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const { assert } = require('chai');
let civilCaseReference, gaCaseReference;
const { createAccount, deleteAccount } = require('../../api/idamHelper.js');

Feature('Create Lip v Lip claim -  Default Judgment @test');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario('Spec Claimant create GA with single application type and HWF', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  console.log(civilCaseReference);
  gaCaseReference = await api.createGAApplicationWithUnrepresented(config.applicantCitizenUser, civilCaseReference, '', true);
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
});

Scenario('Spec Claimant create GA without notice', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresentedWithout(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
              + gaCaseReference + ' ***');
});

Scenario('Spec Claimant create GA without notice judge make final order', async ({ api }) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  gaCaseReference = await api.createGAApplicationWithUnrepresentedWithout(config.applicantCitizenUser, civilCaseReference, 'multiple', false);
  console.log('*** Start Judge Request More Information and Uncloak Application on GA Case Reference: '
    + gaCaseReference + ' ***');
  console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({ api }) => {

});
