/* eslint-disable no-unused-vars */
const config = require('../../config.js');

let civilCaseReference,
    gaCaseReference;

Feature('GA SPEC Claim 1v2 Defendant Response Case Close API tests @api-offline @api-nightly');

Scenario('Case offline AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, 'ONE_V_TWO_SAME_SOL');
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference
        = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Case offline: ' + civilCaseReference + ' ***');
    await api.defendantResponseSpecClaim(config.defendantSolicitorUser, 'COUNTER_CLAIM', 'ONE_V_TWO');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
