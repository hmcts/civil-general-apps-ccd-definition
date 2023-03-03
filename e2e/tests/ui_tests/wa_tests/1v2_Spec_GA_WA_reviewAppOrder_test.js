/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference, expectedReviewApplicationTask,
  expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask,
  expectedReviewApplicationOrderBeforeSDOTask,
  expectedReviewApplicationOrderAfterSDOTask;
if (config.runWAApiTest) {
  expectedReviewApplicationTask = require('../../../../wa/tasks/reviewApplicationTask.js');
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationBeforeSDOTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedReviewApplicationOrderBeforeSDOTask = require('../../../../wa/tasks/reviewApplicationOrderBeforeSDOTask.js');
  expectedReviewApplicationOrderAfterSDOTask = require('../../../../wa/tasks/reviewApplicationOrderAfterSDOTask.js');
}

Feature('1v2 Spec: GA - WA Review application order @e2e-wa');

Scenario('Before SDO GA - Judge Make decision - NBC admin review application order', async ({I, api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 4 NBC admin review application and Refer to Judge');
  if (config.runWAApiTest) {
    const actualReviewApplicationTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.nbcUserReviewGA);
    console.log('actualReviewApplicationTask...', actualReviewApplicationTask);
    wa.validateTaskInfo(actualReviewApplicationTask, expectedReviewApplicationTask);
  }

  await I.login(config.nbcAdminWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.nbcUserReviewGA);
  await wa.goToEvent('Refer to Judge');
  await wa.referToJudge();
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 Judge Approve an order');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  await I.login(config.judgeUserWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeApproveAnOrderWA('makeAnOrder', 'approveOrEditTheOrder', 'no', gaCaseReference, 'General_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.judgeUserWithRegionId4);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 NBC user review application order');
  if (config.runWAApiTest) {
    const actualReviewApplicationOrderTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.reviewApplicationOrder);
    console.log('actualReviewApplicationOrderTask...', actualReviewApplicationOrderTask);
    wa.validateTaskInfo(actualReviewApplicationOrderTask, expectedReviewApplicationOrderBeforeSDOTask);
  }
  await I.login(config.nbcAdminWithRegionId4);
  await wa.goToAdminTask(gaCaseReference);
}).retry(1);

Scenario.skip('After SDO GA - Judge Make decision - HC admin review application order', async ({I, api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 1 Judge Approve an order');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationAfterSDOTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId1,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationAfterSDOTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationAfterSDOTask, expectedJudgeDecideOnApplicationAfterSDOTask);
  }
  await I.login(config.judgeUserWithRegionId1);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeApproveAnOrderWA('makeAnOrder', 'approveOrEditTheOrder', 'no', gaCaseReference, 'General_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'MAKE_DECISION', config.judgeUserWithRegionId1);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 1 review application order');
  if (config.runWAApiTest) {
    const actualReviewApplicationOrder = await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId1,
      gaCaseReference, config.waTaskIds.reviewApplicationOrder);
    console.log('actualReviewApplicationOrder...', actualReviewApplicationOrder);
    wa.validateTaskInfo(actualReviewApplicationOrder, expectedReviewApplicationOrderAfterSDOTask);
  }
  await I.login(config.hearingCenterAdminWithRegionId1);
  await wa.goToAdminTask(gaCaseReference);
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});



