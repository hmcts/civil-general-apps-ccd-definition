/* eslint-disable no-unused-vars */
const config = require('../../config.js');
let civilCaseReference, gaCaseReference;
const mpScenario = 'ONE_V_ONE';
const {createAccount, deleteAccount} = require('../../api/idamHelper.js');

// This test should be enabled after early adopters goes live for all regions

Feature('General Application LR vs LIP 1V1 Application @lip--api-test');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario.skip('GA 1v1 Free Fee  - LR initiates GA vs LIP', async ({api, I}) => {

  civilCaseReference = await api.createSpecifiedClaimWithUnrepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  let hearingDate = await api.createDateString(15);
  gaCaseReference = await api.initiateAdjournVacateGeneralApplication(
    config.applicantSolicitorUser, civilCaseReference, 'No',
    'Yes', hearingDate, '0', 'FREE', '1');
});

Scenario.skip('GA 1v1 Without Notice  - LR initiates GA vs LIP', async ({api, I}) => {

  civilCaseReference = await api.createSpecifiedClaimWithUnrepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser,
    civilCaseReference);
});


AfterSuite(async ({api}) => {
  await api.cleanUp();
  await deleteAccount(config.defendantCitizenUser2.email);
});
