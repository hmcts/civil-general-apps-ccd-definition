/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference, gaCaseReference;

Feature('GA 1v2 Defendants response consent order API tests @api-');

Scenario('Defendants response 1V2', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.amendClaimDocuments(config.applicantSolicitorUser);
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
    console.log('Civil Case created for general application: ' + civilCaseReference);
    console.log('Make a General Application');
    gaCaseReference = await api.initiateConsentGeneralApplication(config.applicantSolicitorUser, civilCaseReference, ['STAY_THE_CLAIM']);

    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentConsentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** NBC Admin Region4 Refer to Judge Process Start ***');
    await api.nbcAdminReferToJudge(config.nbcAdminWithRegionId4, gaCaseReference);
    console.log('*** NBC Admin Region4 Refer to Judge Process End ***');

});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});

