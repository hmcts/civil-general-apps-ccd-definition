/* eslint-disable no-unused-vars */
const config = require('../config.js');
const mpScenario = 'ONE_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;

let {getAppTypes} = require('../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId, childCaseId, childCaseNumber;

Feature('CCD 1v1 - General Application Journey @e2e-tests');

Scenario('Create single general application for 1v1 - Make an order journey', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 1),
    caseNumber, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + caseNumber);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 1), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'yes', childCaseNum());
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  console.log('Judges made a decision on case: ' + childCaseNum());
}).retry(0);

Scenario('Create multiple general applications for 1v1 - Request more information journey', async ({I, api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    caseNumber,
    'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + caseNumber);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 5), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeRequestMoreInfo('requestMoreInfo', 'requestMoreInformation', childCaseNum());
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  console.log('Judges requested more information on case: ' + childCaseNum());
}).retry(0);

AfterSuite(async  ({api}) => {
  await api.cleanUp();
});
