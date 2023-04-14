/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA SPEC Claim 1v1 Judge Make Order Directions Order API tests @api-tests');

Scenario('Judge makes decision 1V1 - DIRECTIONS ORDER', async ({api}) => {
    civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
    console.log('config.runningEnv: ' + config.runningEnv + ' ***');
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

Scenario('Judge makes decision 1V1 - DIRECTIONS ORDER - VARY-JUDGEMENT', async ({api}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithVaryJudgement(config.applicantSolicitorUser,
    civilCaseReference,false, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  console.log('config.runningEnv: ' + config.runningEnv + ' ***');
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

Scenario('Judge makes decision 1V1 - DIRECTIONS ORDER - VARY-JUDGEMENT as Defendant', async ({api}) => {
  civilCaseReference = await api.createSpecifiedClaim(
    config.applicantSolicitorUser, mpScenario);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGaWithVaryJudgement(config.applicantSolicitorUser,
    civilCaseReference,true, false);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
  console.log('config.runningEnv: ' + config.runningEnv + ' ***');
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

Scenario('Make an Urgent General Application with Vary Judgement', async ({api}) => {
    civilCaseReference = await api.createSpecifiedClaim(
        config.applicantSolicitorUser, mpScenario);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGaWithVaryJudgement(config.applicantSolicitorUser,
                                                            civilCaseReference,true, true);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});


