/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 application collection for different solicitor API tests @api-tests');


Scenario('GA 1v2  - Without Notice Application Collection After Judge Makes Decision List for Hearing', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Claimant : ' + gaCaseReference);

  console.log('*** Start Judge makes decision List for Hearing: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
    await api.assertGaAppCollectionVisiblityToUser(config.judgeUser,civilCaseReference,gaCaseReference,'Y');
  }else {
    await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
    await api.assertGaAppCollectionVisiblityToUser(config.judgeLocalUser,civilCaseReference,gaCaseReference,'Y');
  }
  console.log('*** End Judge makes decision - GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  console.log('*** End of Validating  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');

});

Scenario('GA 1v2  - Without Notice Application Collection after Creation of GA Case Test', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Claimant : ' + gaCaseReference);

  console.log('*** Start  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,civilCaseReference,gaCaseReference,null);
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,civilCaseReference,gaCaseReference,null);
  console.log('*** End of Validating  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');

});

Scenario('GA 1v2  - Without Notice Application Collection after Creation of GA Case initiated by Defendant2', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);

  console.log('*** Start  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,civilCaseReference,gaCaseReference,null);
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,civilCaseReference,gaCaseReference,null);
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  console.log('*** End of Validating  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');

});

Scenario('GA 1v2  - Without Notice Application Collection after Judge Makes Decision Order Made', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser, civilCaseReference);
  console.log('Without Notice General Application Initiated by Defendant2 : ' + gaCaseReference);

  console.log('*** Start Judge makes decision order made: ' + gaCaseReference + ' ***');
  if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeMakesDecisionOrderMade(config.judgeUser, gaCaseReference);
  }else {
    await api.judgeMakesDecisionOrderMade(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge makes decision order made - GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,civilCaseReference,gaCaseReference,null);
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,civilCaseReference,gaCaseReference,null);
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  console.log('*** End of Validating  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
});

Scenario('GA 1v2  - With Notice Application Collection after Creation of GA Case Test', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Individual');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithNoStrikeOut(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
  await api.assertGaAppCollectionVisiblityToUser(config.applicantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.defendantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  await api.assertGaAppCollectionVisiblityToUser(config.secondDefendantSolicitorUser,civilCaseReference,gaCaseReference,'Y');
  console.log('*** End of Validating  GA Case Visibility in all Collections: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});

