const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_ONE_LEGAL_REP';
const appStatus = 'Awaiting Respondent Response';
// const childCaseNum = () => `${childCaseId.split('-').join('')}`;

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId;

Feature('CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('Create Single general application for 1v2 Same Solicitor', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 1),
    caseNumber, '' +
    'no', 'no', 'yes', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('General Application created: ' + caseNumber);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 1), 1);
  await I.see(appStatus);
  // childCaseId = await I.grabChildCaseNumber();
  // Refactor as part of CIV-1425
 /*
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 1));
  console.log('Responded to application: ' + childCaseNum());
  await I.click('Close and Return to case details');
  await I.verifyResponseSummaryPage();*/
}).retry(1);
