const config = require('../config.js');
let caseNumber;
let caseId;
let appTypes = ['Strike out', 'Summary judgment', 'Stay the claim', 'Extend time'];


Feature('General Application @smoke-tests');

Scenario('Applicant solicitor should be able to go to General app screen', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.goToGeneralAppScreenAndVerifyAllApps(appTypes, caseId, caseNumber);
}).retry(2);
