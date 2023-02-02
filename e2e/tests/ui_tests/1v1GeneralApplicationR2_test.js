/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const judgeDecisionStatus = 'Application Submitted - Awaiting Judicial Decision';
const listForHearingStatus = 'Listed for a Hearing';
const claimantType = 'Company';
const childCaseNum = () => `${childCaseNumber.split('-').join('')}`;
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../api/testingSupport');

let {getAppTypes} = require('../../pages/generalApplication/generalApplicationTypes');
let civilCaseReference, gaCaseReference, caseId, childCaseNumber;

Feature('GA R2 1v1 - General Application Journey');

Scenario('GA R2 1v1 - Without Notice - Vary Judgement - Hearing order journey', async ({I, api}) => {
/*  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Case created for general application: ' + civilCaseReference);*/
  await I.login(config.applicantSolicitorUser);
  await I.initiateGA('1675333090819134', getAppTypes().slice(10, 11), 'yes', 'no', 'no', 'no');
  gaCaseReference = await api.getGACaseReference(config.applicantSolicitorUser, '1675333090819134');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.applicantSolicitorUser);
  await I.clickAndVerifyTab('1675333090819134', 'Applications', getAppTypes().slice(10, 11), 5);
  await I.see(judgeDecisionStatus);
  await I.navigateToTab(gaCaseReference, 'Application');
  await I.verifyApplicantSummaryPage();
  await I.verifyN245FormElements();
  await I.navigateToTab(gaCaseReference, 'Application Documents');
  await I.verifyN245FormElements();
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
  }
  await I.login(config.applicantSolicitorUser);
  await I.navigateToTab(gaCaseReference, 'Applications');
  await I.see(listForHearingStatus);
}).retry(0);

AfterSuite(async ({api}) => {
   await api.cleanUp();
});
