/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge accepts strike out application API tests @api-tests');

Scenario('Judge makes decision 1V2 - Accept Strike out application', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Organisation');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge approves strike out application: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeApprovesStrikeOutApplication(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeApprovesStrikeOutApplication(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge approves strike out application - GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
