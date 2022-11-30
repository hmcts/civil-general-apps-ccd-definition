/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA Claim 1v2 Notify Claim Case Close API tests @api-nightly @api-offline');

Scenario('Case offline 1V2 notify_claim AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state AWAITING_RESPONDENT_RESPONSE');
    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'CASE_ISSUED');

    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
