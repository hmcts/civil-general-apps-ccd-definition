/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';

let civilCaseReference,
    gaCaseReference;

Feature('GA Claim 1v2 Notify Claim Case Close API tests @api-tests @api-offline');

Scenario('Case offline 1V2 notify_claim AWAITING_RESPONDENT_RESPONSE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state AWAITING_RESPONDENT_RESPONSE');
    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'CASE_ISSUED');

    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state APPLICATION_SUBMITTED_AWAITING_JUDICIAL_DECISION');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details AWAITING_ADDITIONAL_INFORMATION', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'CASE_ISSUED');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeMakesDecisionAdditionalInformation(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeMakesDecisionAdditionalInformation(config.judgeLocalUser, gaCaseReference);
    }

    console.log('*** Start Respondent respond to Judge Additional information on GA Case Reference: '
                + gaCaseReference + ' ***');
    await api.respondentResponseToJudgeAdditionalInfo(config.applicantSolicitorUser, gaCaseReference);
    console.log('*** End Respondent respond to Judge Additional information on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details LISTING_FOR_A_HEARING', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'CASE_ISSUED');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeListApplicationForHearing(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeListApplicationForHearing(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');


    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details AWAITING_WRITTEN_REPRESENTATIONS', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state AWAITING_WRITTEN_REPRESENTATIONS');
    gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);

    console.log('*** Start Judge Directions Order on GA Case Reference: ' + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeMakesDecisionWrittenRep(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeMakesDecisionWrittenRep(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge Directions Order GA Case Reference: ' + gaCaseReference + ' ***');


    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details APPLICATION_ADD_PAYMENT', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state APPLICATION_ADD_PAYMENT');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
    console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeRequestMoreInformationUncloak(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeRequestMoreInformationUncloak(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details AWAITING_DIRECTIONS_ORDER_DOCS', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    gaCaseReference
        = await api.initiateGeneralApplicationWithState(config.applicantSolicitorUser, civilCaseReference, 'CASE_ISSUED');
    console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
    await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
    console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('*** Start Judge List the application for hearing on GA Case Reference: ' + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeMakesDecisionDirectionsOrder(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeMakesDecisionDirectionsOrder(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge List the application for hearing GA Case Reference: ' + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'PROCEEDS_IN_HERITAGE');
});

Scenario('Case offline 1V2 notify_claim_details ORDER_MADE', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state ORDER_MADE');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
    console.log('*** Start Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeMakesOrderDecisionUncloak(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeMakesOrderDecisionUncloak(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge Make Decision Uncloak and Application Approved on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'ORDER_MADE');
});

Scenario('Case offline 1V2 notify_claim_details APPLICATION_DISMISSED', async ({api}) => {
    civilCaseReference = await api.createUnspecifiedClaim(
        config.applicantSolicitorUser, mpScenario, 'Company');

    console.log('Make a General Application with state APPLICATION_DISMISSED');
    gaCaseReference
        = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
    console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: '
                + gaCaseReference + ' ***');
    if(['preview', 'demo', 'aat'].includes(config.runningEnv)) {
        await api.judgeDismissApplication(config.judgeUser, gaCaseReference);
    }else {
        await api.judgeDismissApplication(config.judgeLocalUser, gaCaseReference);
    }
    console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: '
                + gaCaseReference + ' ***');

    console.log('Case offline');
    await api.partialNotifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference, 'AWAITING_CASE_DETAILS_NOTIFICATION');
    await api.verifyGAState(config.applicantSolicitorUser, civilCaseReference, gaCaseReference, 'APPLICATION_DISMISSED');
});

AfterSuite(async ({api}) => {
    await api.cleanUp();
});