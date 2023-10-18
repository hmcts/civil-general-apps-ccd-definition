/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge Dismiss Application API tests @api-nightly');

Scenario('Judge makes decision 1V2 - DISMISS_THE_APPLICATION @123', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application 1');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 2');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 3');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 4');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 5');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 6');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('Make a General Application 7');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  // await api.cleanUp();
});
