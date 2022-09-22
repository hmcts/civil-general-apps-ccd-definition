/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, childCaseNumber;

Feature('General Application Smoke tests @ga-smoke-tests');

Scenario('GA Smoke Tests', async ({I, api}) => {
  parentCaseNumber = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, parentCaseNumber);
  await api.notifyClaimDetails(config.applicantSolicitorUser, parentCaseNumber);
  console.log('Case created for general application: ' + parentCaseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  childCaseNumber = await I.grabCaseNumber();
  await I.goToGeneralAppScreenAndVerifyAllApps(getAppTypes(), childCaseNumber);
  console.log('Verified General Applications: ' + parentCaseNumber);
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
