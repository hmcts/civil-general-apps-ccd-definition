/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA 1v2 Defendant Response Case Close API tests');

Scenario('Case offline AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Case offline: ' + civilCaseReference + ' ***');
    await api.defendantResponse(config.defendantSolicitorUser, mpScenario, civilCaseReference, true);
    await api.defendantResponse(config.secondDefendantSolicitorUser, mpScenario, civilCaseReference, false);

    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
