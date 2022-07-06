/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Judge Make Order Directions Order API tests @api-tests');

Scenario('Judge makes decision 1V2 - DIRECTIONS ORDER', async ({api}) => {
    civilCaseReference = await api.createClaimWithRepresentedRespondent(
        config.applicantSolicitorUser, mpScenario);
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});
