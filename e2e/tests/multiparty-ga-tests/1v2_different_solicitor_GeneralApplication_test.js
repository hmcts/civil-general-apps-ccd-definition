const config = require('../../config.js');
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const appStatus = 'Awaiting Respondent Response';
// const childCaseNum = () => `${childCaseId.split('-').join('')}`;

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId;

Feature('CCD 1v2 Different Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('Create Multiple general application for 1v2 different Solicitor and respond to application', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 3),
    caseNumber,
    'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + caseNumber);
  await I.see(caseId);
  await I.click('Close and Return to case details');
  await I.wait(5);
  await I.see(caseEventMessage('Make an application'));
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 3), 1);
  await I.see(appStatus);
  // childCaseId = await I.grabChildCaseNumber();
  // Refactor as part of CIV-1425
  /*await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 3));
  console.log('Responded to application: ' + childCaseNum());
  await I.click('Close and Return to case details');
  await I.verifyResponseSummaryPage();*/
  // await I.judgeMakeDecision('makeAnOrder');
}).retry(1);
