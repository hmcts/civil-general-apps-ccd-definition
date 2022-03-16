const config = require('../config.js');
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
const mpScenario = 'ONE_V_ONE';
const appStatus = 'Application Submitted - Awaiting Judicial Decision';
const childCaseNum = () => `${childCaseId.split('-').join('')}`;

let {getAppTypes} = require('../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId, childCaseId;

Feature('CCD 1v1 - General Application Journey @e2e-tests');

Scenario('Create case for 1v1', async ({api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
}).retry(1);

Scenario('Create Single general application for 1v1 and respond to application', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 1),
    caseNumber, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + caseNumber);
  await I.see(caseId);
  await I.click('Close and Return to case details');
  await I.see(caseEventMessage('Make an application'));
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 1), 1);
  await I.see(appStatus);
  childCaseId = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'yes');
}).retry(0);

Scenario('Create Multiple general applications for 1v1', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    caseNumber,
    'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + caseNumber);
  await I.see(caseId);
  await I.click('Close and Return to case details');
  await I.see(caseEventMessage('Make an application'));
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 5), 2);
  await I.see(appStatus);
  childCaseId = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  await I.judgeMakeDecision('makeAnOrder', 'dismissTheApplication', 'yes');
}).retry(0);
