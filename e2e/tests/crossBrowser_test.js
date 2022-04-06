const config = require('../config.js');
const mpScenario = 'ONE_V_ONE';
const appStatus = 'Awaiting Respondent Response';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;

let {getAppTypes} = require('../pages/generalApplication/generalApplicationTypes');
let caseNum, caseId, childCaseId, childCaseNumber;

Feature('End-to-end General application journey @cross-browser-tests');

Scenario('GA end-to-end journey', async ({I, api}) => {
  // To do
  caseNum = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNum);
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNum);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    getAppTypes().slice(0, 5),
    caseNum,
    'no', 'no', 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter');
  console.log('General Application created: ' + caseNum);
  await I.closeAndReturnToCaseDetails(caseId);
  await I.clickAndVerifyTab('Applications', getAppTypes().slice(0, 5), 1);
  await I.see(appStatus);
  // Refactor as part of CIV-1425
  childCaseNumber = await I.grabChildCaseNumber();
  await I.respondToApplication(childCaseNum(), 'yes', 'yes', 'yes', 'yes', 'no',
    'signLanguageInterpreter', getAppTypes().slice(0, 5));
  console.log('Responded to application: ' + childCaseNum());
  childCaseId = await I.grabGACaseNumber();
  await I.respCloseAndReturnToCaseDetails(childCaseId);
  await I.verifyResponseSummaryPage();
  await I.judgeRequestMoreInfo('requestMoreInfo', 'sendApplicationToOtherParty', childCaseNum());
  await I.judgeCloseAndReturnToCaseDetails(childCaseId);
  console.log('Judges sent application to other party and requested hearing details on case: ' + childCaseNum());
}).retry(0);

