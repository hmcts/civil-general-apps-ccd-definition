/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA 1v2 Case Close API tests @api-tests');

Scenario('Case offline 1V2 AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
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

Scenario('Case offline 1V2 APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 AWAITING_ADDITIONAL_INFORMATION', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge Make Decision on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeMakesDecisionAdditionalInformation(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Make Decision GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Respondent respond to Judge Additional information on GA Case Reference: '
                + gaCaseReference + ' ***');
    await api.respondentResponseToJudgeAdditionalInfo(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Respondent respond to Judge Additional information on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 LISTING_FOR_A_HEARING', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeListApplicationForHearing(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');


    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 AWAITING_WRITTEN_REPRESENTATIONS', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state AWAITING_WRITTEN_REPRESENTATIONS');
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeMakesDecisionWrittenRep(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');


    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 APPLICATION_ADD_PAYMENT', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state APPLICATION_ADD_PAYMENT');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
    console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');
    await api.judgeRequestMoreInformationUncloak(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 AWAITING_DIRECTIONS_ORDER_DOCS', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
    await api.judgeMakesDecisionDirectionsOrder(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 ORDER_MADE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state ORDER_MADE');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
    console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');
    await api.judgeMakesOrderDecisionUncloak(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario('Case offline 1V2 APPLICATION_DISMISSED', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');
    await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);

    console.log('Make a General Application with state APPLICATION_DISMISSED');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference, 'AWAITING_RESPONDENT_RESPONSE');
    console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: '
                + gaCaseReference + ' ***');
    await api.judgeDismissApplication(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaimDetails(config.applicantSolicitorUser, mpScenario, civilCaseReference);
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'APPLICATION_DISMISSED');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});

