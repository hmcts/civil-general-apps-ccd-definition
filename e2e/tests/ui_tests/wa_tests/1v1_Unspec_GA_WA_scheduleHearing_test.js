/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_ONE';
const states = require('../../../fixtures/ga-ccd/state.js');

const listForHearingStatus = states.LISTING_FOR_A_HEARING.id;


let civilCaseReference, gaCaseReference, expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedLADecideOnApplicationBeforeSDOTask, expectedScheduleAppHearingBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask, expectedScheduleAppHearingAfterSDOTask,
  judgeUser;
if (config.runWAApiTest) {
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationBeforeSDOTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/laDecideOnApplicationBeforeSDOTask.js');
  expectedScheduleAppHearingBeforeSDOTask = require('../../../../wa/tasks/scheduleAppHearingBeforeSDOTask.js');
  expectedScheduleAppHearingAfterSDOTask = require('../../../../wa/tasks/scheduleAppHearingAfterSDOTask.js');
}

Feature('1v1 UnSpec claim: GA - WA Scenarios @e2e-wa');

Scenario.skip('Before SDO GA - Judge Make decision - NBC admin schedule Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  if (['preview', 'aat'].includes(config.runningEnv)) {
    judgeUser = config.judgeUser;
  } else if (['demo'].includes(config.runningEnv)) {
    judgeUser = config.judgeUserWithRegionId4;
  } else {
    judgeUser = config.judgeLocalUser;
  }

  console.log('Region 4 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(judgeUser,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  await I.login(judgeUser);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, listForHearingStatus, judgeUser);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 NBC admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
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

Scenario.skip('Before SDO GA - LA Make decision - NBC admin schedule Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaForLA(config.applicantSolicitorUser, civilCaseReference);

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
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, listForHearingStatus,
    config.tribunalCaseworkerWithRegionId4);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 4 NBC admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
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

Scenario('After SDO GA - Judge Make decision - HC admin schedule Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company', '11000');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaForJudge(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 1 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationAfterSDOTask = await api.retrieveTaskDetails(config.judgeUser2WithRegionId2,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualLADecideOnApplicationTask...', actualJudgeDecideOnApplicationAfterSDOTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationAfterSDOTask, expectedJudgeDecideOnApplicationAfterSDOTask);
  }

  await I.login(config.judgeUser2WithRegionId2);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, listForHearingStatus, config.judgeUser2WithRegionId2);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 1 HCA admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId2,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
    console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
    wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingAfterSDOTask);
  }

  await I.login(config.hearingCenterAdminWithRegionId2);
  await wa.goToTask(gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
  await I.fillHearingNotice(gaCaseReference, 'claimAndDef', 'basildon', 'VIDEO');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.HEARING_SCHEDULED.id,
    config.hearingCenterAdminWithRegionId2);
  console.log('Hearing Notice created for: ' + gaCaseReference);
  await wa.verifyNoActiveTask(gaCaseReference);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});



