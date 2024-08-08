/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
let civilCaseReference, gaCaseReference;

Feature('1v1 unspecified assert general application unavailable before respondent assigned @api-tests');

Scenario('1v1 unspecified assert general application unavailable before respondent assigned @api-tests', async ({I,api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  console.log('Assert Make a General Application fails, as respondent not assigned');
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(civilCaseReference);
  await I.verifyNoAccessToGeneralApplications(errorMsg);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

