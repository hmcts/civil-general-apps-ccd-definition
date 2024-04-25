/* eslint-disable no-unused-vars */
const config = require('../../config.js');
let civilCaseReference, gaCaseReference;
const mpScenario = 'ONE_V_ONE';
const claimAmountJudge = '11000';

Feature('General Application LR vs LIP 1V1 @lrvslip ');

Scenario('GA 1v1  - Judge Makes Decision Order Made @lrvslip ', async ({api, I}) => {

  civilCaseReference = await api.createClaimWithRespondentLitigantInPerson(config.applicantSolicitorUser, mpScenario);
  await api.notifyClaimLip(config.applicantSolicitorUser);
  await api.notifyClaimDetailsLip(config.applicantSolicitorUser, mpScenario);

  console.log('Civil Case created for general application: ' + civilCaseReference);
  console.log('Make a General Application');
  gaCaseReference = await api.initiateGeneralApplicationWithOutNotice(config.applicantSolicitorUser, civilCaseReference);
});

AfterSuite(async ({api}) => {
  //await api.cleanUp();
});
