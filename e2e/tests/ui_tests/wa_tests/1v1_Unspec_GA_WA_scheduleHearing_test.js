/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, expectedReviewApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedLADecideOnApplicationBeforeSDOTask, expectedScheduleAppHearingBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask;
if (config.runWAApiTest) {
  expectedReviewApplicationTask = require('../../../../wa/tasks/reviewApplicationTask.js');
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationBeforeSDOTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/laDecideOnApplicationBeforeSDOTask.js');
  expectedScheduleAppHearingBeforeSDOTask = require('../../../../wa/tasks/scheduleAppHearingBeforeSDOTask.js');
}

Feature('1v1 Unspec: GA - WA Schedule Application Hearing @e2e-wa');

Scenario('Before SDO GA - Judge Make decision - NBC admin review scheduled Application Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
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

  console.log('Region 4 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  await I.login(config.judgeUserWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'LISTING_FOR_A_HEARING', config.judgeUserWithRegionId4);
  await wa.verifyNoActiveTask(gaCaseReference);

   console.log('Region 4 NBC admin review scheduled Application Hearing');
   if (config.runWAApiTest) {
     const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4, gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
     console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
     wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingBeforeSDOTask);
   }
   await I.login(config.nbcAdminWithRegionId4);
   await wa.goToAdminTask(gaCaseReference);
}).retry(1);

Scenario.skip('Before SDO GA - LA Make decision - NBC admin review', async ({I, api, wa}) => {
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
  await wa.goToEvent('Refer to Legal Advisor');
  await wa.referToLA();
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 LA List for a hearing');
  if (config.runWAApiTest) {
    const actualLADecideOnApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
    console.log('actualLADecideOnApplicationTask...', actualLADecideOnApplicationTask);
    wa.validateTaskInfo(actualLADecideOnApplicationTask, expectedLADecideOnApplicationBeforeSDOTask);
  }
  await I.login(config.tribunalCaseworkerWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'LISTING_FOR_A_HEARING', config.tribunalCaseworkerWithRegionId4);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 NBC admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
    console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
    wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingBeforeSDOTask);
  }
  await I.login(config.nbcAdminWithRegionId4);
  await wa.goToAdminTask(gaCaseReference);
}).retry(1);

Scenario.skip('After SDO GA - Judge Make decision - HC admin review', async ({I, api, wa}) => {
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 1 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationAfterSDOTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId1,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualLADecideOnApplicationTask...', actualJudgeDecideOnApplicationAfterSDOTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationAfterSDOTask, expectedJudgeDecideOnApplicationAfterSDOTask);
  }
  await I.login(config.judgeUserWithRegionId1);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, 'LISTING_FOR_A_HEARING', config.judgeUserWithRegionId1);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 HCA admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId1,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
    console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
    wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingBeforeSDOTask);
  }
  await I.login(config.hearingCenterAdminWithRegionId1);
  await wa.goToAdminTask(gaCaseReference);
}).retry(1);


AfterSuite(async ({api}) => {
  await api.cleanUp();
});



