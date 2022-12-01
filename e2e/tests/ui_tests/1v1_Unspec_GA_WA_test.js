/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('1v1 Unspec: General Application - WA Journey @e2e-wa');

Scenario('Before SDO GA - NBC user - Judge - HCA test', async ({I, api, wa}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

  if (config.runWAApiTest) {
    const reviewApplicationTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4, gaCaseReference, config.waTaskIds.nbcUserReviewGA);
    console.log('reviewApplicationTask...' , reviewApplicationTask);
  }

  await I.login(config.nbcAdminWithRegionId4);
  await wa.goToTask(gaCaseReference, config.waTaskIds.nbcUserReviewGA);
  await wa.goToEvent('Refer to Judge');
  await wa.referToJudge();
  await wa.verifyNoActiveTask(gaCaseReference, 'Refer to Judge');
}).retry(0);


