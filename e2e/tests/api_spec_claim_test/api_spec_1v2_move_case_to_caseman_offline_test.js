/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA SPEC Claim 1v2 Move to Case Man Case Close API tests @api-tests @api-offline');

Scenario('Case offline 1V2 AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, 'ONE_V_TWO_SAME_SOL');
    gaCaseReference
        = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
    await api.moveCaseToCaseman(config.adminUser);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});