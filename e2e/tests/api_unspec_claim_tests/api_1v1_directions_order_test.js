/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 Judge Make Order Directions Order API tests @api-tests');

Scenario('Judge makes decision 1V1 - DIRECTIONS ORDER - Respondent upload Directions Document', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Respondent respond to Judge Directions on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseToJudgeDirections(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Respondent respond to Judge Directions GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge makes decision 1V1 - VARY-JUDGEMENT - DIRECTIONS ORDER - Respondent upload Directions Document', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithVaryJudgement(config.applicantSolicitorUser, civilCaseReference,true);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Respondent respond to Judge Directions on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseToJudgeDirections(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Respondent respond to Judge Directions GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge makes decision 1V1 - VARY-JUDGEMENT  as DEFENDANT - DIRECTIONS ORDER - Respondent upload Directions Document', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithVaryJudgement(config.applicantSolicitorUser, civilCaseReference,false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Respondent respond to Judge Directions on GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponseToJudgeDirections(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Respondent respond to Judge Directions GA Case Reference: ' + gaCaseReference + ' ***');
});
AfterSuite(async ({api}) => {
  await api.cleanUp();
});

