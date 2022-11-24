/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference,
    gaCaseReference;

Feature('GA Claim 1v1 Claimant Response Case Close API tests @api-tests @api-offline');

Scenario('Case offline 1V2 AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    await api.acknowledgeClaim(config.defendantSolicitorUser, civilCaseReference, true);
    console.log('Civil Case created for general application: ' + civilCaseReference);

    console.log('Make a General Application with state AWAITING_RESPONDENT_RESPONSE');
    gaCaseReference
        = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Case offline: ' + civilCaseReference + ' ***');
    await api.defendantResponseClaim(config.defendantSolicitorUser, mpScenario, 'solicitorOne');
    await api.claimantResponseClaim(config.applicantSolicitorUser, 'NOT_PROCEED', 'ONE_V_TWO',
                                    'AWAITING_APPLICANT_INTENTION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
