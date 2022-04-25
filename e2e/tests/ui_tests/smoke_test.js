const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
let caseNumber, caseId;
let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');

Feature('General Application @smoke-tests');

Scenario('Applicant solicitor should be able to go to General app screen', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.goToGeneralAppScreenAndVerifyAllApps(getAppTypes(), caseId);
}).retry(1);
