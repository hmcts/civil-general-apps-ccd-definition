const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const apiRequest = require("../../../api/apiRequest");
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, expectedSpecificAccessRequestJudiciary, expectedSpecificAccessRequestAdmin,
expectedSpecificAccessRequestLegalOps;
if (config.runWAApiTest) {

  expectedSpecificAccessRequestJudiciary = require('../../../../wa/tasks/reviewSpecifiAccessRequestJudiciary.js');
  expectedSpecificAccessRequestAdmin = require('../../../../wa/tasks/reviewSpecifiAccessRequestAdmin.js');
  expectedSpecificAccessRequestLegalOps = require('../../../../wa/tasks/reviewSpecifiAccessRequestLegalOps.js');
}

Feature(' GA - WA Specific Access @e2e-wa');

Scenario('Verify Specific access check for NBC Admin @e2e-wa', async ({I, WA, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  await I.login(config.iacAdminUser);
  await WA.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    const specifiAccessRequestTask = await api.retrieveTaskDetails(config.nbcAdminWithRegionId4, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestAdmin);
  } else {
    console.log('WA flag is not enabled');
    return;
  }
  await I.login(config.nbcAdminWithRegionId4);
  await WA.runSpecificAccessApprovalSteps(gaCaseReference);

  await api.verifySpecificAccessForGaCaseData(config.iacAdminUser,gaCaseReference)
});

Scenario('Verify Specific access check for judge @e2e-wa', async ({I, WA, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);

  await api.nbcAdminReferToJudge(config.nbcAdminWithRegionId4, gaCaseReference)

  await I.login(config.iacLeadershipJudge);
  await WA.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    const specifiAccessRequestTask = await api.retrieveTaskDetails(config.judgeUserWithRegionId4, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestJudiciary);
  } else {
    console.log('WA flag is not enabled');
    return;
  }
  await I.login(config.judgeUserWithRegionId4);
  await WA.runSpecificAccessApprovalSteps(gaCaseReference);

  await api.verifySpecificAccessForGaCaseData(config.iacLeadershipJudge,gaCaseReference)
});

Scenario('Verify Specific access check for Legal Ops @e2e-wa', async ({I, WA, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);
  await api.nbcAdminReferToLegalAdvisor(config.nbcAdminWithRegionId4, gaCaseReference)
  await I.login(config.iacLegalOpsUser);
  await WA.runSpecificAccessRequestSteps(gaCaseReference);
  if (config.runWAApiTest) {
    const specifiAccessRequestTask = await api.retrieveTaskDetails(config.tribunalCaseworkerWithRegionId4, gaCaseReference, config.waTaskIds.reviewSpecificAccessRequestLegalOps);
  } else {
    console.log('WA flag is not enabled');
    return;
  }
  await I.login(config.tribunalCaseworkerWithRegionId4);
  await WA.runSpecificAccessApprovalSteps(gaCaseReference);

  await api.verifySpecificAccessForGaCaseData(config.iacLegalOpsUser,gaCaseReference)
});
