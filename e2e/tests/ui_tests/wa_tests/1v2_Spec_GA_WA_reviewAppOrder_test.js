/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const states = require('../../../fixtures/ga-ccd/state.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

const omStatus = states.ORDER_MADE.id;
const listForHearingStatus = states.LISTING_FOR_A_HEARING.id;


let civilCaseReference, gaCaseReference,
  expectedLADecideOnApplicationBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask,
  expectedReviewApplicationOrderBeforeSDOTask,
  expectedReviewApplicationOrderAfterSDOTask,
  expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedScheduleAppHearingBeforeSDOTask;
if (config.runWAApiTest) {
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/laDecideOnApplicationForSAJTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedReviewApplicationOrderBeforeSDOTask = require('../../../../wa/tasks/reviewApplicationOrderBeforeSDOTask.js');
  expectedReviewApplicationOrderAfterSDOTask = require('../../../../wa/tasks/reviewApplicationOrderAfterSDOTask.js');
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationForSAJTask.js');
  expectedScheduleAppHearingBeforeSDOTask = require('../../../../wa/tasks/scheduleAppHearingBeforeSDOTask.js');
}

Feature('1v2 Spec: GA - WA Review application order @e2e-wa');

Scenario('LA refer to judge - R4 Judge Make decision - - NBC admin schedule Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaForJudge(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 4 LA List for a hearing');
  if (config.runWAApiTest) {
    const actualLADecideOnApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
    console.log('actualLADecideOnApplicationTask...', actualLADecideOnApplicationTask);
    wa.validateTaskInfo(actualLADecideOnApplicationTask, expectedLADecideOnApplicationBeforeSDOTask);
  }

  await I.login(config.tribunalCaseworkerWithRegionId4);
  await wa.verifyAdminTask(gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
  await wa.goToEvent('Refer to Judge');
  await wa.referToJudge();
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  await I.login(config.judgeUserWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order', config.judgeUserWithRegionId4);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, listForHearingStatus, config.judgeUserWithRegionId4);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 NBC admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4, gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
    console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
    wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingBeforeSDOTask);
  }

  await I.login(config.nbcAdminWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
  await I.fillHearingNotice(gaCaseReference, 'claimAndDef', 'basildon', 'VIDEO');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.HEARING_SCHEDULED.id, config.nbcAdminWithRegionId4);
  console.log('Hearing Notice created for: ' + gaCaseReference);
  await wa.verifyNoActiveTask(gaCaseReference);
});

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
  await I.judgeApproveAnOrderWA('makeAnOrder', 'approveOrEditTheOrder', 'no', gaCaseReference, 'General_order', config.judgeUserWithRegionId1);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, omStatus, config.judgeUserWithRegionId1);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 1 review application order');
  if (config.runWAApiTest) {
    const actualReviewApplicationOrder = await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId1,
      gaCaseReference, config.waTaskIds.reviewApplicationOrder);
    console.log('actualReviewApplicationOrder...', actualReviewApplicationOrder);
    wa.validateTaskInfo(actualReviewApplicationOrder, expectedReviewApplicationOrderAfterSDOTask);
  }
  await I.login(config.hearingCenterAdminWithRegionId1);
  // await wa.goToAdminTask(gaCaseReference);
}).retry(1);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});



