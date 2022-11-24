/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA 1v2 Notify Claim Details Case Close API tests @api-nightly @api-offline');

Scenario('Case offline 1V2 notify_claim_details AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state AWAITING_RESPONDENT_RESPONSE');
    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    console.log('Verify');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
