/* eslint-disable no-unused-vars */
const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess,
  waitForFinishedBusinessProcess, waitForGAFinishedBusinessProcess} = require('../../../api/testingSupport');
const states = require('../../../fixtures/ga-ccd/state.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

const listForHearingStatus = states.LISTING_FOR_A_HEARING.id;

let civilCaseReference, gaCaseReference,
  expectedLADecideOnApplicationBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask,
  expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedScheduleAppHearingBeforeSDOTask,
  expectedScheduleAppHearingAfterSDOTask;

if (config.runWAApiTest) {
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/laDecideOnApplicationForSAJTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../../wa/tasks/judgeDecideOnApplicationForSAJTask.js');
  expectedScheduleAppHearingBeforeSDOTask = require('../../../../wa/tasks/scheduleAppHearingBeforeSDOTask.js');
  expectedScheduleAppHearingAfterSDOTask = require('../../../../wa/tasks/scheduleAppHearingAfterSDOTask.js');
}

Feature('1v2 Spec claim: GA - WA Scenarios @e2e-wa');

Scenario('LA refer to judge - R4 Judge Make decision - NBC admin schedule Hearing', async ({I, api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaForJudge(config.applicantSolicitorUser, civilCaseReference);

  console.log('Region 4 LA referring to Judge');
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

// Enable test after this CIV-8283 bug fix
Scenario('After SDO GA - Change court location  - HC admin review application order @123', async ({I, api, wa}) => {
  civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, 'ONE_V_TWO_SAME_SOL');
  console.log('Civil Case created for general application: ' + civilCaseReference);

  gaCaseReference = await api.initiateGaForJudge(config.applicantSolicitorUser, civilCaseReference);

/*  console.log('Region 4 LA referring to Judge');
  if (config.runWAApiTest) {
    const actualLADecideOnApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
    console.log('actualLADecideOnApplicationTask...', actualLADecideOnApplicationTask);
    wa.validateTaskInfo(actualLADecideOnApplicationTask, expectedLADecideOnApplicationBeforeSDOTask);
  }*/

/*  await I.login(config.tribunalCaseworkerWithRegionId4);
  await wa.verifyAdminTask(gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
  await wa.goToEvent('Refer to Judge');
  await wa.referToJudge();
  await wa.verifyNoActiveTask(gaCaseReference);*/

  console.log('Changing court location');
  await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO');
  await api.claimantResponseClaimSpec(config.applicantSolicitorUser, 'FULL_DEFENCE', 'ONE_V_TWO',
    'JUDICIAL_REFERRAL');
  await waitForFinishedBusinessProcess(civilCaseReference, config.applicantSolicitorUser);
  await waitForGAFinishedBusinessProcess(civilCaseReference, config.applicantSolicitorUser);
/*
  console.log('Region 1 Judge List for a hearing');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId1,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationAfterSDOTask);
  }
  await I.login(config.judgeUserWithRegionId1);
  await wa.goToTask(gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
  await I.judgeListForAHearingDecisionWA('listForAHearing', gaCaseReference, 'no', 'Hearing_order', config.judgeUserWithRegionId1);
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, listForHearingStatus, config.judgeUserWithRegionId1);
  await wa.verifyNoActiveTask(gaCaseReference);

  console.log('Region 1 HCA admin review scheduled Application Hearing');
  if (config.runWAApiTest) {
    const actualScheduleApplicationHearingTask = await api.retrieveTaskDetails(config.hearingCenterAdminWithRegionId1,
      gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
    console.log('actualScheduleApplicationHearingTask...', actualScheduleApplicationHearingTask);
    wa.validateTaskInfo(actualScheduleApplicationHearingTask, expectedScheduleAppHearingAfterSDOTask);
  }

  await I.login(config.hearingCenterAdminWithRegionId1);
  await wa.goToTask(gaCaseReference, config.waTaskIds.scheduleApplicationHearing);
  await I.fillHearingNotice(gaCaseReference, 'claimAndDef', 'basildon', 'VIDEO');
  await waitForGACamundaEventsFinishedBusinessProcess(gaCaseReference, states.HEARING_SCHEDULED.id, config.hearingCenterAdminWithRegionId1);
  console.log('Hearing Notice created for: ' + gaCaseReference);
  await wa.verifyNoActiveTask(gaCaseReference);*/
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});



