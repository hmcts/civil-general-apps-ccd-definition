/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const mpScenario = 'ONE_V_TWO_TWO_LEGAL_REP';
const {I} = inject();

let civilCaseReference, gaCaseReference, gaCaseReferenceSolicitorOne, gaCaseReferenceSolicitorTwo;

Feature('GA 1v2 Judge Dismiss Application API tests @api-nightly');

Scenario('1V2 Different Solicitors - Respondent Solicitors initiate Without Application', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);

  console.log('Respondent Solicitor One - Make a General Application without notice');
  gaCaseReferenceSolicitorOne = await api.initiateGeneralApplicationWithOutNotice(config.defendantSolicitorUser,
    civilCaseReference);

  await I.wait(12);

  console.log('Respondent Solicitor Two - Make a General Application without notice');
  gaCaseReferenceSolicitorTwo = await api.initiateGeneralApplicationWithOutNotice(config.secondDefendantSolicitorUser,
    civilCaseReference, 'respondentTwoCollection');

  console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReferenceSolicitorOne + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeDismissApplication(config.judgeUser, gaCaseReferenceSolicitorOne);
  } else {
    await api.judgeDismissApplication(config.judgeLocalUser, gaCaseReferenceSolicitorOne);
  }
  console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReferenceSolicitorOne + ' ***');

  console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReferenceSolicitorTwo + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeDismissApplication(config.judgeUser, gaCaseReferenceSolicitorTwo);
  } else {
    await api.judgeDismissApplication(config.judgeLocalUser, gaCaseReferenceSolicitorTwo);
  }
  console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReferenceSolicitorTwo + ' ***');
});

Scenario('Judge makes decision 1V2 - DISMISS_THE_APPLICATION', async ({api}) => {
  civilCaseReference = await api.createUnspecifiedClaim(
    config.applicantSolicitorUser, mpScenario, 'Company');
  await api.amendClaimDocuments(config.applicantSolicitorUser);
  await api.notifyClaim(config.applicantSolicitorUser, mpScenario, civilCaseReference);
  await api.notifyClaimDetails(config.applicantSolicitorUser, civilCaseReference);
  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplication(config.applicantSolicitorUser, civilCaseReference);

  console.log('*** Start response to GA Case Reference: ' + gaCaseReference + ' ***');
  await api.respondentResponse1v2(config.defendantSolicitorUser, config.secondDefendantSolicitorUser, gaCaseReference);
  console.log('*** End Response to GA Case Reference: ' + gaCaseReference + ' ***');

  console.log('*** Start Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReference + ' ***');
  if (['preview', 'demo', 'aat'].includes(config.runningEnv)) {
    await api.judgeDismissApplication(config.judgeUser, gaCaseReference);
  } else {
    await api.judgeDismissApplication(config.judgeLocalUser, gaCaseReference);
  }
  console.log('*** End Judge Make Decision Application Dismiss on GA Case Reference: ' + gaCaseReference + ' ***');
});

AfterSuite(async ({api}) => {
  await api.cleanUp();
});
