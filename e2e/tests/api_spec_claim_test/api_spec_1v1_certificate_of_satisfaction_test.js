const config = require('../../config.js');
const { createAccount, deleteAccount} = require('../../api/idamHelper.js');

let civilCaseReference;

Feature('GA SPEC Claim 1v1 Certification of Satisfaction/Cancellation @api-cui @api-nonprod');

Before(async () => {
  await createAccount(config.defendantCitizenUser2.email, config.defendantCitizenUser2.password);
});

Scenario('1v1 LR v LIP Spec case marked paid in full @api-nonprod', async ({api}) => {
  civilCaseReference = await api.createSpecifiedClaimWithUnrepresentedRespondent(config.applicantSolicitorUser, 'ONE_V_ONE');
  await api.amendRespondent1ResponseDeadline(config.systemUpdate);
  await api.defaultJudgmentXuiPayImmediately(config.applicantSolicitorUser);
  await api.markJudgmentPaid(config.applicantSolicitorUser);
  await api.certificateOfSatisfactionCancellationCui(config.defendantCitizenUser1, civilCaseReference);
});

Scenario('1v1 LIP v LIP Spec Case marked paid in full', async ({api}) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  await api.amendRespondent1ResponseDeadline(config.systemUpdate);
  await api.defaultJudgmentCui(config.applicantCitizenUser);
  await api.certificateOfSatisfactionCancellationCui(config.defendantCitizenUser2, civilCaseReference);
});

Scenario('1v1 LIP v LIP Spec Case not marked paid in full', async ({api}) => {
  civilCaseReference = await api.createClaimWithUnrepresentedClaimant(config.applicantCitizenUser, 'SmallClaims', 'INDIVIDUAL');
  await api.amendRespondent1ResponseDeadline(config.systemUpdate);
  await api.defaultJudgmentCui(config.applicantCitizenUser);
  await api.judgmentPaidInFullCui(config.applicantCitizenUser);
  await api.certificateOfSatisfactionCancellationCui(config.defendantCitizenUser2, civilCaseReference);
});

AfterSuite(async ({ api }) => {
  await api.cleanUp();
  await deleteAccount(config.defendantCitizenUser2.email);
});
