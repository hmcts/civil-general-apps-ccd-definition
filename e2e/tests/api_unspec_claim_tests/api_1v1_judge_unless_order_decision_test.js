/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA 1v1 Judge make decision unless order API tests');

Scenario('Judge makes decision 1V1 - unless order  @api-tests', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithUnlessOrder(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge makes decision unless order: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision unless order - GA Case Reference: ' + gaCaseReference + ' ***');
});

Scenario('Judge Revisit 1V1 - unless order End Date Scheduler @api-scheduler-test', async ({api}) => {

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithUnlessOrder(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');
  let state;
  console.log('*** Start Judge makes decision unless order and : ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    state = await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeUser, gaCaseReference);
  }else {
    state = await api.judgeMakesDecisionOrderMadeUnlessOrderAppln(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision unless order - GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Triggering Judge Revisit unless order Scheduler ***');
  await api.judgeRevisitUnlessScheduler(gaCaseReference,state );
  console.log('*** End of Judge Revisit unless order Scheduler ***');

});

AfterSuite(async ({api}) => {
  //await api.cleanUp();
});
