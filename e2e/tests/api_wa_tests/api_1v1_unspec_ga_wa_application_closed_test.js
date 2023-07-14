const config = require('../../config.js');
// eslint-disable-next-line no-unused-vars
const {systemUpdate} = require('../../config');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature(' GA - WA Application Closed @api-wa');

Scenario.skip('1v1 Unspec GA-WA Application closed test', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);
  // We need to fix the below steps
/*  await api.amendclaimDismissedDeadline(config.systemUpdate);
  await api.caseDismisalScheduler(civilCaseReference, gaCaseReference, systemUpdate);*/
}).retry(0);

AfterSuite(async ({api}) => {
  await api.cleanUp();
});


