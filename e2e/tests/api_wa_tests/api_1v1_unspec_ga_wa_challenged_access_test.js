const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, expectedReviewApplicationTask,expectedJudgeDecideOnApplicationBeforeSDOTask,expectedLADecideOnApplicationBeforeSDOTask;
if (config.runWAApiTest) {
  expectedReviewApplicationTask = require('../../../wa/tasks/reviewApplicationTask.js');
  expectedJudgeDecideOnApplicationBeforeSDOTask = require('../../../wa/tasks/judgeDecideOnApplicationBeforeSDOTask.js');
  expectedLADecideOnApplicationBeforeSDOTask = require('../../../wa/tasks/laDecideOnApplicationBeforeSDOTask.js');
}

Feature('GA - WA Challenged Access @api-wa');

Scenario('GA - Challenged Access test - NBCAdmin & judge', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  console.log('*** Validate Task Initiation for Review Application - Start ***');
  if (config.runWAApiTest) {
    const actualReviewApplicationTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.nbcUserReviewGA);
    console.log('actualReviewApplicationTask...', actualReviewApplicationTask);
    wa.validateTaskInfo(actualReviewApplicationTask, expectedReviewApplicationTask);
  }
  console.log('*** Validate Task Initiation for Review Application - End ***');

  console.log('*** Challenged Access steps for nbcAdmin - Start ***');
  await I.login(config.nbcAdminWithRegionId1);
  await wa.runChallengedAccessSteps(gaCaseReference);
  console.log('*** Challenged Access steps for nbcAdmin - End ***');

  console.log('*** NBC Admin Region4 Refer to Judge Process Start ***');
  await api.nbcAdminReferToJudge(config.nbcAdminWithRegionId4, gaCaseReference);
  console.log('*** NBC Admin Region4 Refer to Judge Process End ***');

  console.log('*** Validate Task Initiation for Judge Decide On Application - Start ***');
  if (config.runWAApiTest) {
    const actualJudgeDecideOnApplicationTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4,
      gaCaseReference, config.waTaskIds.judgeDecideOnApplication);
    console.log('actualJudgeDecideOnApplicationTask...', actualJudgeDecideOnApplicationTask);
    wa.validateTaskInfo(actualJudgeDecideOnApplicationTask, expectedJudgeDecideOnApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for Judge Decide On Application- End ***');

  console.log('*** Challenged Access steps for Judge - Start ***');
  await I.login(config.judgeUserWithRegionId1);
  await wa.runChallengedAccessSteps(gaCaseReference);
  console.log('*** Challenged Access steps for Judge - End ***');

}).retry(0);

Scenario('GA - Challenged Access test - LegalAdvisor', async ({I, api, wa}) => {
  civilCaseReference = await api.createSpecifiedClaim(config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
  console.log('General Application Created Successfully');
  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Validate Task Initiation for Review Application - Start ***');
  if (config.runWAApiTest) {
    const actualReviewApplicationTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4,
      gaCaseReference, config.waTaskIds.nbcUserReviewGA);
    console.log('actualReviewApplicationTask...', actualReviewApplicationTask);
    wa.validateTaskInfo(actualReviewApplicationTask, expectedReviewApplicationTask);
  }
  console.log('*** Validate Task Initiation for Review Application - End ***');

  console.log('*** NBC Admin Region4 Refer to Legal Advisor Process Start ***');
  await api.nbcAdminReferToLegalAdvisor(config.nbcAdminWithRegionId4, gaCaseReference);
  console.log('*** NBC Admin Region4 Refer to Legal Advisor Process End ***');

  console.log('*** Validate Task Initiation for Legal Advisor Decide On Application - Start ***');
  if (config.runWAApiTest) {
    const actualLegalAdvisorDecideOnApplicationTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4,
      gaCaseReference, config.waTaskIds.legalAdvisorDecideOnApplication);
    console.log('actualLegalAdvisorDecideOnApplicationTask...', actualLegalAdvisorDecideOnApplicationTask);
    wa.validateTaskInfo(actualLegalAdvisorDecideOnApplicationTask, expectedLADecideOnApplicationBeforeSDOTask);
  }
  console.log('*** Validate Task Initiation for legal Advisor Decide On Application- End ***');

  console.log('*** Challenged Access steps for LegalAdvisor - Start ***');
  await I.login(config.tribunalCaseworkerWithRegionId);
  await wa.runChallengedAccessSteps(gaCaseReference);
  console.log('*** Challenged Access steps for LegalAdvisor - End ***');

}).retry(0);


AfterSuite(async ({api}) => {
  await api.cleanUp();
});

