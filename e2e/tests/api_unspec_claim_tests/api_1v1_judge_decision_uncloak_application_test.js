/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, claimantType;

Feature('GA 1v1 Judge Make Decision Uncloak application API  @api-tests');

Scenario('Judge makes decision 1V1 - ORDER_MADE - Uncloak and Application Approved', async ({api}) => {
  claimantType = 'Company';

  civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, claimantType);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);

  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application without notice');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser,
    civilCaseReference);

  console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');
  await api.judgeMakesDecisionApplicationUncloak(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
    + gaCaseReference + ' ***');

  console.log('*** Start Callback for Additional Payment Failure: ' + gaCaseReference + ' ***');
  await api.additionalPaymentFailure(config.applicantSolicitorUser, gaCaseReference);
  console.log('*** End Callback for Additional Payment Failure on GA Case Reference: ' + gaCaseReference + ' ***');

});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
