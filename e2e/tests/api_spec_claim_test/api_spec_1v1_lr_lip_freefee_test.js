/* eslint-disable no-unused-vars */
const config = require('../../config.js');
let civilCaseReference, gaCaseReference;
const mpScenario = 'ONE_V_ONE';

Feature('General Application LR vs LIP 1V1 Application @lip--api-test');

Scenario.skip('GA 1v1 Free Fee  - LR initiates GA vs LIP', async ({api, I}) => {

  civilCaseReference = await api.createClaimWithRespondentLitigantInPerson(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimLip(config.applicantSolicitorUser);
  await api.notifyClaimDetailsLip(config.applicantSolicitorUser, mpScenario);


  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  /*console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);
  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser2WithRegionId2, gaCaseReference);
  }else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');

  await I.login(config.defendantSolicitorUser);
  await I.navigateToTab(civilCaseReference, 'Applications');
  await I.see('Order Made');*/
});


AfterSuite(async ({api}) => {
  await api.cleanUp();
});
