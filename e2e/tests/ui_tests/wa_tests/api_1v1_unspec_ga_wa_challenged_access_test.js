const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, expectedReviewApplicationTask;
if (config.runWAApiTest) {
  expectedReviewApplicationTask = require('../../../../wa/tasks/reviewApplicationTask.js');
}

Feature(' GA - WA Challenged Access @e2e-wa');

Scenario('GA - Challenged Access test - NBCAdmin', async ({I, api, wa}) => {
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
  await wa.runChallengedAccessSteps(config.nbcAdminWithRegionId1,gaCaseReference);
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
