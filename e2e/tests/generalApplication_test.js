const config = require('../config.js');
const {waitForFinishedBusinessProcess} = require('../api/testingSupport');
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
let caseNumber;
let caseId;
let appTypes = ['Strike out', 'Stay the claim', 'Extend time', 'Summary judgment'];

Feature('General Application creation @e2e-tests');

Scenario('Create case for @ga', async ({api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser);
  console.log('Case created for general application: ' + caseNumber);
});

Scenario('Applicant solicitor creates Single general application @ga', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.selectApplicationType(appTypes.slice(0, 1), caseNumber);
  await I.selectConsentCheck('no');
  await I.isUrgentApplication('yes');
  await I.selectNotice('yes');
  await I.enterApplicationDetails();
  await I.fillHearingDetails('no', 'no', 'no', 'no', 'disabledAccess');
  await I.selectPbaNumber('no');
  await I.verifyCheckAnswerForm(caseNumber, 'no');
  await I.submitApplication();
  await verifyGeneralApplication(I, caseId, appTypes.slice(0, 1));
}).retry(2);

Scenario('Applicant solicitor creates Multiple general applications @ga', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.selectApplicationType(appTypes.slice(0, 3), caseNumber);
  await I.selectConsentCheck('yes');
  await I.isUrgentApplication('no');
  await I.enterApplicationDetails();
  await I.fillHearingDetails('yes', 'yes', 'yes', 'no', 'signLanguageInterpreter')
  await I.selectPbaNumber('yes');
  await I.verifyCheckAnswerForm(caseNumber, 'yes');
  await I.submitApplication();
  await verifyGeneralApplication(I, caseId, appTypes.slice(0, 3));
}).retry(2);

const verifyGeneralApplication = async (I, caseId, appType) => {
  console.log('General Application created: ' + caseNumber);
  await I.see(caseId);
  await waitForFinishedBusinessProcess(caseNumber);
  await I.verifyGAConfirmationPage(appType);
  await I.click('Close and Return to case details');
  await I.see(caseEventMessage('Make an application'));
};
