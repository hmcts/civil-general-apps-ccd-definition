/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let parentCaseNumber, caseId, childCaseId, childCaseNumber;

Feature('GA CCD 1v1 - General Application Journey @e2e-tests');

Scenario('GA for 1v1 - Make an order journey', async ({I, api}) => {
  parentCaseNumber = await api.createClaimWithRepresentedRespondent(
    config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + parentCaseNumber);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(parentCaseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(3, 4),
    parentCaseNumber, '' +
    'yes', 'no', 'no', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('1v1 General Application created: ' + parentCaseNumber);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(3, 4), 1);
  await I.see(judgeDecisionStatus);
  childCaseNumber = await I.grabChildCaseNumber();
  await I.navigateToCaseDetails(childCaseNum());
  childCaseId = await I.grabCaseNumber();
  await I.judgeMakeDecision('makeAnOrder', 'approveOrEditTheOrder', 'yes', childCaseNum());
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  console.log('Judges made a decision on case: ' + childCaseNum());
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
