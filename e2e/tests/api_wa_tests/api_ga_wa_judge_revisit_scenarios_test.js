const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';
const genAppType = 'STAY_THE_CLAIM';

let civilCaseReference, gaCaseReference, expectedJudgeDecideOnApplicationBeforeSDOTask,
  expectedLADecideOnApplicationBeforeSDOTask,
  expectedJudgeDecideOnApplicationAfterSDOTask, expectedJudgeRevisitApplicationBeforeSDOTask, expectedLARevisitApplicationBeforeSDOTask, expectedJudgeRevisitApplicationAfterSDOTask;
if (config.runWAApiTest) {
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../wa/tasks/judgeDecideOnApplicationBeforeSDOTask.js');
  expectedJudgeDecideOnApplicationAfterSDOTask = require('../../../wa/tasks/judgeDecideOnApplicationAfterSDOTask.js');
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../wa/tasks/laDecideOnApplicationBeforeSDOTask.js');
  expectedJudgeRevisitApplicationBeforeSDOTask = require('../../../wa/tasks/judgeRevisitApplicationBeforeSDO.js');
  expectedLARevisitApplicationBeforeSDOTask = require('../../../wa/tasks/legalAdvisorRevisitApplication.js');
  expectedJudgeRevisitApplicationAfterSDOTask = require('../../../wa/tasks/judgeRevisitApplicationAfterSDO.js');
}

Feature(' GA - WA Judge Revisit Applications @api-wa');

Scenario.skip('Before SDO GA - Directions Order Additional Response time Expired', async ({api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  console.log('*** Validate Task Initiation for Judge Decide On Application - Start ***');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for Judge Decide On Application- End ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.judgeMakesDecisionDirectionsOrder(config.judgeUserWithRegionId4, gaCaseReference);
  console.log('*** End Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Triggering Judge Revisit Directions Order Scheduler ***');
  await api.judgeRevisitScheduler(gaCaseReference, 'AWAITING_DIRECTIONS_ORDER_DOCS', genAppType);
  console.log('*** End of Judge Revisit Directions Order Scheduler ***');

  console.log('*** Validate Task Initiation for Judge Revisit Application- Start ***');
  if (config.runWAApiTest) {
    const actualJudgeRevisitApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeRevisitApplication);
    console.log('actualJudgeRevisitApplicationTask...', actualJudgeRevisitApplicationTask);
    wa.validateTaskInfo(actualJudgeRevisitApplicationTask, expectedJudgeRevisitApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for Judge Revisit Application- End ***');

}).retry(0);

Scenario.skip('Before SDO GA 1v1 spec - Written Representations Additional Response time Expired', async ({api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaForJudge(config.applicantSolicitorUser, civilCaseReference);
  console.log('General Application Created Successfully');

  console.log('*** Validate Task Initiation for Legal Advisor Decide On Application - Start ***');
  if (config.runWAApiTest) {
    const actualLegalAdvisorDecideOnApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
    console.log('actualLegalAdvisorDecideOnApplicationTask...', actualLegalAdvisorDecideOnApplicationTask);
    wa.validateTaskInfo(actualLegalAdvisorDecideOnApplicationTask, expectedLADecideOnApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for legal Advisor Decide On Application- End ***');
  let state;
  console.log('*** Start Judge Make Order on GA Case Reference - WRITTEN_REPRESENTATIONS: ' + gaCaseReference + ' ***');
  state =await api.judgeMakesDecisionWrittenRep(config.tribunalCaseworkerWithRegionId4, gaCaseReference);
  console.log('*** End Judge Make Order GA Case Reference - WRITTEN_REPRESENTATIONS: ' + gaCaseReference + ' ***');

  console.log('*** Triggering Legal Advisor Revisit Written Representations Scheduler ***');
  await api.judgeRevisitScheduler(gaCaseReference, state, genAppType);
  console.log('*** End of Legal Advisor Revisit Written Representations Scheduler ***');

  console.log('*** Validate Task Initiation for Legal Advisor Revisit Application- Start ***');
  if (config.runWAApiTest) {
    const actualLARevisitApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorRevisitApplication);
    console.log('actualLARevisitApplicationTask...', actualLARevisitApplicationTask);
    console.log('expected...', expectedLARevisitApplicationBeforeSDOTask);
    wa.validateTaskInfo(actualLARevisitApplicationTask, expectedLARevisitApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for Legal Advisor Revisit Application- End ***');

}).retry(0);

Scenario.skip('1V2 Unspec After SDO - Judge Revist Application- Request More Information Additional Response time Expired', async ({
                                                                                                                                     api,
                                                                                                                                     wa
                                                                                                                                   }) => {
  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
  await api.claimantResponseUnSpec(config.applicantSolicitorUser, mpScenario, 'JUDICIAL_REFERRAL');

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
  console.log('General Application Created Successfully');
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Validate Task Initiation for Judge Decide On Application - Start ***');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId1,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationAfterSDOTask);
  }
  console.log('*** Validate Task Initiation for Judge Decide On Application- End ***');

  console.log('*** Start Judge Make Decision on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeMakesDecisionAdditionalInformation(config.judgeUserWithRegionId1, gaCaseReference);
  console.log('*** End Judge Make Decision GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Triggering Legal Advisor Revisit Directions Order Scheduler ***');
  // await api.judgeRevisitScheduler(gaCaseReference,'state');
  console.log('*** End of Legal Advisor Revisit Directions Order Scheduler ***');

  console.log('*** Validate Task Initiation for Judge Revisit Application- Start ***');
  if (config.runWAApiTest) {
    const actualJudgeRevisitApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeRevisitApplication);
    console.log('actualJudgeRevisitApplicationTask...', actualJudgeRevisitApplicationTask);
    wa.validateTaskInfo(actualJudgeRevisitApplicationTask, expectedJudgeRevisitApplicationAfterSDOTask);
  }
  console.log('*** Validate Task Initiation for Judge Revisit Application- End ***');

}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
