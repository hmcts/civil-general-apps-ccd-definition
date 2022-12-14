const config = require('../../../config.js');
const {waitForGACamundaEventsFinishedBusinessProcess} = require('../../../api/testingSupport');
const apiRequest = require("../../../api/apiRequest");
const {systemupdate} = require("../../../config");
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference, expectedSpecificAccessRequestJudiciary, expectedSpecificAccessRequestAdmin,
  expectedSpecificAccessRequestLegalOps;
/*if (config.runWAApiTest) {

  expectedSpecificAccessRequestJudiciary = require('../../../../wa/tasks/reviewSpecifiAccessRequestJudiciary.js');
  expectedSpecificAccessRequestAdmin = require('../../../../wa/tasks/reviewSpecifiAccessRequestAdmin.js');
  expectedSpecificAccessRequestLegalOps = require('../../../../wa/tasks/reviewSpecifiAccessRequestLegalOps.js');
}*/

Feature(' GA - WA Application Closed @e2e-wa');

Scenario('1v1 Unspec GA-WA Application closed test @e2e-wa', async ({I, wa, api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
  console.log('*** General Application case created ***' + gaCaseReference);
  await api.amendclaimDismissedDeadline(config.systemupdate);
  await api.caseDismisalScheduler(civilCaseReference,gaCaseReference,systemupdate);

}).retry(0);
