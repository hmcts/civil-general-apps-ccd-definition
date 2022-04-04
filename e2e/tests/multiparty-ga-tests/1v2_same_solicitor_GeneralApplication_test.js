const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_ONE_LEGAL_REP';
const appStatus = 'Awaiting Respondent Response';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let caseNumber, caseId, childCaseNumber, childCaseId;

Feature('CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('Create Single general application for 1v2 Same Solicitor - respond to application - Sequential written representations journey', async ({I, api}) => {
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
  // Refactor as part of CIV-1425
  childCaseNumber = await I.grabChildCaseNumber();
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 1));
  console.log('Responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.judgeWrittenRepresentationsDecision('orderForWrittenRepresentations', 'sequentialRep', childCaseNum());
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  console.log('Judges made an order for Sequential written representations on case: ' + childCaseNum());
}).retry(0);
