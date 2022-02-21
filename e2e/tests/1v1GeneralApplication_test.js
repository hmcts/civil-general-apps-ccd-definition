const config = require('../config.js');
const {waitForFinishedBusinessProcess} = require('../api/testingSupport');
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
const mpScenario = 'ONE_V_ONE';
let caseNumber;
let caseId;
let appTypes = ['Strike out', 'Stay the claim', 'Extend time', 'Summary judgment'];

Feature('CCD 1v1 - General Application Journey @e2e-tests');

Scenario('Create case for 1v1', async ({api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
});

Scenario('Create Single general application for 1v1', async ({I}) => {
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
  await I.clickOnHearingDetailsChangeLink('no');
  await I.updateHearingDetails();
  await I.see('update@gmail.com');
  await I.submitApplication();
  await verifyGeneralApplication(I, caseId, appTypes.slice(0, 1));
  await I.clickOnTab('Applications');
  pause();
}).retry(2);

Scenario.skip('Create Multiple general applications for 1v1', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.selectApplicationType(appTypes.slice(0, 3), caseNumber);
  await I.selectConsentCheck('yes');
  await I.isUrgentApplication('no');
  await I.enterApplicationDetails();
  await I.fillHearingDetails('yes', 'yes', 'yes', 'no', 'signLanguageInterpreter');
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
