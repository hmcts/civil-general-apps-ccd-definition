const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature(' GA - WA Specific Access @api-wa');

Scenario('Verify Specific access check for NBC Admin', async ({I, wa, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  await I.login(config.iacAdminUser);
  await wa.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    await api.retrieveTaskDetails(config.nbcTeamLead, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestAdmin);
  } else {
    console.log('WA flag is not enabled');
    return;
  }

  await I.login(config.nbcTeamLead);
  let approve_type = '7 days';
  await wa.runSpecificAccessApprovalSteps(gaCaseReference, approve_type);
  await api.verifySpecificAccessForGaCaseData(config.iacAdminUser, gaCaseReference);
});

Scenario('Verify Specific access check for judge', async ({I, wa, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  await api.nbcAdminReferToJudge(config.nbcAdminWithRegionId4, gaCaseReference) ;
  await I.login(config.iacLeadershipJudge);
  await wa.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    await api.retrieveTaskDetails(config.leaderShipJudge, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestJudiciary);
  } else {
    console.log('WA flag is not enabled');
    return;
  }
  await I.login(config.leaderShipJudge);
  await wa.runJudgeSpecificAccessApprovalSteps(gaCaseReference);
  await api.verifySpecificAccessForGaCaseData(config.iacLeadershipJudge, gaCaseReference);
});

Scenario('Verify Specific access check for Legal Ops', async ({I, wa, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);
  await api.nbcAdminReferToLegalAdvisor(config.nbcAdminWithRegionId4, gaCaseReference);
  await I.login(config.iacLegalOpsUser);
  await wa.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    await api.retrieveTaskDetails(config.srTribunalCaseworker, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestLegalOps);
  } else {
    console.log('WA flag is not enabled');
    return;
  }
  await I.login(config.srTribunalCaseworker);
  let approve_type = '7 days';
  await wa.runSpecificAccessApprovalSteps(gaCaseReference, approve_type);
  await api.verifySpecificAccessForGaCaseData(config.iacLegalOpsUser, gaCaseReference);
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
