const config = require('../../config.js');
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
const mpScenario = 'TWO_V_ONE';
const appStatus = 'Application Submitted - Awaiting Judicial Decision';
// const childCaseNum = () => `${childCaseId.split('-').join('')}`;

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId;

Feature('CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('Create Multiple general application for 2v1', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 4),
    caseNumber,
    'no', 'no', 'no', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + caseNumber);
  await I.see(caseId);
  await I.click('Close and Return to case details');
  await I.see(caseEventMessage('Make an application'));
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 4), 1);
  await I.see(appStatus);
  // Refactor as part of CIV-1425
  // childCaseId = await I.grabChildCaseNumber();
 /* await I.navigateToCaseDetails(childCaseNum());
  await I.judgeMakeDecision('makeAnOrder', 'giveDirections', 'no');*/
}).retry(1);
