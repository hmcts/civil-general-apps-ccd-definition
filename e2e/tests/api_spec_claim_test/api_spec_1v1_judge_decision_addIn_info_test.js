/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_ONE';

let civilCaseReference, gaCaseReference;

Feature('GA SPEC Claim 1v1 Judge Make Decision Additional Information Required API tests @api-test-spec-claim');

Scenario('Judge makes decision 1V1 - AWAITING_ADDITIONAL_INFORMATION', async ({api}) => {
    civilCaseReference = await api.createClaimSpecWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);

    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse(config.defendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge Make Decision on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeMakesDecision(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Make Decision GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});

