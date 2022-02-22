const config = require('../../config.js');
const {waitForFinishedBusinessProcess} = require("../../api/testingSupport");
const caseEventMessage = eventName => `Case ${caseId} has been updated with event: ${eventName}`;
const mpScenario = 'TWO_V_ONE';
let caseNumber;
let caseId;
let appTypes = ['Strike out', 'Stay the claim', 'Extend time', 'Summary judgment'];

Feature('CCD 1v2 Same Solicitor - General Application Journey @multiparty-e2e-tests');

Scenario('Claimant solicitor raises a claim for 2 claimants against 1 defendant', async ({api}) => {
  caseNumber = await api.createClaimWithRepresentedRespondent(config.applicantSolicitorUser, mpScenario);
  console.log('Case created for general application: ' + caseNumber);
});

Scenario('Create Single general application for 2v1', async ({I}) => {
  await I.login(config.applicantSolicitorUser);
  await I.navigateToCaseDetails(caseNumber);
  caseId = await I.grabCaseNumber();
  await I.createGeneralApplication(
    appTypes.slice(0, 1),
    caseNumber, '' +
    'no', 'yes', 'yes', 'no', 'no', 'no', 'no',
    'disabledAccess');
  console.log('General Application created: ' + caseNumber);
  await I.see(caseId);
  await waitForFinishedBusinessProcess(caseNumber);
  await I.click('Close and Return to case details');
  await I.see(caseEventMessage('Make an application'));
}).retry(2);
