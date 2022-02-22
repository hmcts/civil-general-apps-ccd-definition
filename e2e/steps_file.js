// in this file you can append custom step methods to 'I' object

const output = require('codeceptjs').output;

const config = require('./config.js');
const parties = require('./helpers/party.js');
const loginPage = require('./pages/login.page');
const continuePage = require('./pages/continuePage.page');
const caseViewPage = require('./pages/caseView.page');
const createCasePage = require('./pages/createClaim/createCase.page');
const solicitorReferencesPage = require('./pages/createClaim/solicitorReferences.page');
const claimantSolicitorOrganisation = require('./pages/createClaim/claimantSolicitorOrganisation.page');
const claimantSolicitorOrganisationLRspec = require('./pages/createClaim/claimantSolicitorOrganisationLRspec.page');
const claimantSolicitorServiceAddress = require('./pages/createClaim/claimantSolicitorServiceAddress.page');
const addAnotherClaimant = require('./pages/createClaim/addAnotherClaimant.page');
const claimantSolicitorIdamDetailsPage = require('./pages/createClaim/idamEmail.page');
const defendantSolicitorOrganisation = require('./pages/createClaim/defendantSolicitorOrganisation.page');
const defendantSolicitorOrganisationLRspec = require('./pages/createClaim/defendantSolicitorOrganisationLRspec.page');
const defendantSolicitorServiceAddress = require('./pages/createClaim/defendantSolicitorServiceAddress.page');
const secondDefendantSolicitorServiceAddress = require('./pages/createClaim/secondDefendantSolicitorServiceAddress.page');
const defendantSolicitorEmail = require('./pages/createClaim/defendantSolicitorEmail.page');
const chooseCourtPage = require('./pages/createClaim/chooseCourt.page');
const claimantLitigationDetails = require('./pages/createClaim/claimantLitigationDetails.page');
const addAnotherDefendant = require('./pages/createClaim/addAnotherDefendant.page');
const respondent2SameLegalRepresentative = require('./pages/createClaim/respondent2SameLegalRepresentative.page');
const secondDefendantSolicitorReference = require('./pages/createClaim/secondDefendantSolicitorReference.page');
const claimTypePage = require('./pages/createClaim/claimType.page');
const respondentRepresentedPage = require('./pages/createClaim/isRespondentRepresented.page');
const personalInjuryTypePage = require('./pages/createClaim/personalInjuryType.page');
const detailsOfClaimPage = require('./pages/createClaim/detailsOfClaim.page');
const uploadParticularsOfClaimQuestion = require('./pages/createClaim/uploadParticularsOfClaimQuestion.page');
const uploadParticularsOfClaim = require('./pages/createClaim/uploadParticularsOfClaim.page');
const claimValuePage = require('./pages/createClaim/claimValue.page');
const pbaNumberPage = require('./pages/createClaim/pbaNumber.page');
const paymentReferencePage = require('./pages/createClaim/paymentReference.page');

const responseIntentionPage = require('./pages/acknowledgeClaim/responseIntention.page');

const caseProceedsInCasemanPage = require('./pages/caseProceedsInCaseman/caseProceedsInCaseman.page');
const takeCaseOffline = require('./pages/caseProceedsInCaseman/takeCaseOffline.page');

const extensionDatePage = require('./pages/informAgreedExtensionDate/date.page');

const responseTypePage = require('./pages/respondToClaim/responseType.page');
const uploadResponsePage = require('./pages/respondToClaim/uploadResponseDocument.page');

const proceedPage = require('./pages/respondToDefence/proceed.page');
const uploadResponseDocumentPage = require('./pages/respondToDefence/uploadResponseDocument.page');

const defendantLitigationFriendPage = require('./pages/addDefendantLitigationFriend/defendantLitigationDetails.page');

const statementOfTruth = require('./fragments/statementOfTruth');
const party = require('./fragments/party');
const event = require('./fragments/event');
const respondentDetails = require('./fragments/respondentDetails.page');
const confirmDetailsPage = require('./fragments/confirmDetails.page');

const applicationTypePage = require('./pages/generalApplication/applicationType.page');
const consentCheckPage = require('./pages/generalApplication/consentCheck.page');
const urgencyCheckPage = require('./pages/generalApplication/urgencyCheck.page');
const withOutNoticePage = require('./pages/generalApplication/withOutNotice.page');
const enterApplicationDetailsPage = require('./pages/generalApplication/applicationDetails.page');
const hearingAndTrialPage = require('./pages/generalApplication/hearingDetails.page');
const gaPBANumberPage = require('./pages/generalApplication/gaPBANumber.page');
const answersPage = require('./pages/generalApplication/checkYourAnswers.page');
const confirmationPage = require('./pages/generalApplication/gaConfirmation.page');
// DQ fragments
const fileDirectionsQuestionnairePage = require('./fragments/dq/fileDirectionsQuestionnaire.page');
const disclosureOfElectronicDocumentsPage = require('./fragments/dq/disclosureOfElectrionicDocuments.page');
const disclosureOfNonElectronicDocumentsPage = require('./fragments/dq/disclosureOfNonElectrionicDocuments.page');
const expertsPage = require('./fragments/dq/experts.page');
const witnessPage = require('./fragments/dq/witnesses.page');
const hearingPage = require('./fragments/dq/hearing.page');
const draftDirectionsPage = require('./fragments/dq/draftDirections.page');
const requestedCourtPage = require('./fragments/dq/requestedCourt.page');
const hearingSupportRequirementsPage = require('./fragments/dq/hearingSupportRequirements.page');
const furtherInformationPage = require('./fragments/dq/furtherInformation.page');
const welshLanguageRequirementsPage = require('./fragments/dq/language.page');

const events = require('./fixtures/ccd/events.js');
const address = require('./fixtures/address.js');
const specCreateCasePage = require('./pages/createClaim/createCaseLRspec.page');
const specPartyDetails = require('./fragments/claimantDetailsLRspec');
const specParty = require('./fragments/partyLRspec');
const specClaimantLRPostalAddress = require('./fixtures/claimantLRPostalAddressLRspec');
const specRespondentRepresentedPage = require('./pages/createClaim/isRespondentRepresentedLRspec.page');
const specDefendantSolicitorEmailPage = require('./pages/createClaim/defendantSolicitorEmailLRspec.page');
const specDefendantLRPostalAddress = require('./fixtures/defendantLRPostalAddressLRspec');
const specTimelinePage = require('./pages/createClaim/claimTimelineLRspec.page');
const specAddTimelinePage = require('./pages/createClaim/addTimelineLRspec.page');
const specListEvidencePage = require('./pages/createClaim/claimListEvidenceLRspec.page');
const specClaimAmountPage = require('./pages/createClaim/claimAmountLRspec.page');
const specInterestPage = require('./pages/createClaim/interestLRspec.page');
const specInterestValuePage = require('./pages/createClaim/interestValueLRspec.page');
const specInterestRatePage = require('./pages/createClaim/interestRateLRspec.page');
const specInterestDateStartPage = require('./pages/createClaim/interestDateStartLRspec.page');
const specInterestDateEndPage = require('./pages/createClaim/interestDateEndLRspec.page');
const specConfirmDefendantsDetails = require('./fragments/confirmDefendantsDetailsLRspec');
const specConfirmLegalRepDetails = require('./fragments/confirmLegalRepDetailsLRspec');
const responseTypeSpecPage = require('./pages/respondToClaimLRspec/responseTypeLRspec.page');
const defenceTypePage = require('./pages/respondToClaimLRspec/defenceTypeLRspec.page');
const freeMediationPage = require('./pages/respondToClaimLRspec/freeMediationLRspec.page');
const chooseCourtSpecPage = require('./pages/respondToClaimLRspec/chooseCourtLRspec.page');
const smallClaimsHearingPage = require('./pages/respondToClaimLRspec/hearingSmallClaimsLRspec.page');
const useExpertPage = require('./pages/respondToClaimLRspec/useExpertLRspec.page');
const respondentCheckListPage = require('./pages/respondToClaimLRspec/respondentCheckListLRspec.page');
const enterWitnessesPage = require('./pages/respondToClaimLRspec/enterWitnessesLRspec.page');
const disputeClaimDetailsPage = require('./pages/respondToClaimLRspec/disputeClaimDetailsLRspec.page');
const claimResponseTimelineLRspecPage = require('./pages/respondToClaimLRspec/claimResponseTimelineLRspec.page');
const hearingLRspecPage = require('./pages/respondToClaimLRspec/hearingLRspec.page');
const furtherInformationLRspecPage = require('./pages/respondToClaimLRspec/furtherInformationLRspec.page');
const disclosureReportPage = require('./fragments/dq/disclosureReport.page');


const SIGNED_IN_SELECTOR = 'exui-header';
const SIGNED_OUT_SELECTOR = '#global-header';
const CASE_HEADER = 'ccd-case-header > h1';

const TEST_FILE_PATH = './e2e/fixtures/examplePDF.pdf';

let caseId, screenshotNumber, eventName, currentEventName;
let eventNumber = 0;

const getScreenshotName = () => eventNumber + '.' + screenshotNumber + '.' + eventName.split(' ').join('_') + '.png';
const conditionalSteps = (condition, steps) => condition ? steps : [];

const selectApplicationType = (eventName, applicationType, caseId) => [
  () => caseViewPage.startEvent(eventName, caseId),
  () => applicationTypePage.selectApplicationType(applicationType),
];

const selectConsentCheck = (consentCheck) => [
  () => consentCheckPage.selectConsentCheck(consentCheck)
];

const isUrgentApplication = (urgent) => [
  () => urgencyCheckPage.selectUrgencyRequirement(urgent),
];

const selectNotice = (notice) => [
  () => withOutNoticePage.selectNotice(notice),
];

const enterApplicationDetails = () => [
  () => enterApplicationDetailsPage.enterApplicationDetails(TEST_FILE_PATH),
];

const fillHearingDetails = (hearingScheduled, judgeRequired, trialRequired, unavailableTrailRequired, supportRequirement) => [
  () => hearingAndTrialPage.isHearingScheduled(hearingScheduled),
  () => hearingAndTrialPage.isJudgeRequired(judgeRequired),
  () => hearingAndTrialPage.isTrialRequired(trialRequired),
  () => hearingAndTrialPage.selectHearingPreferences('inPerson'),
  () => hearingAndTrialPage.selectHearingDuration('fortyFiveMin'),
  () => hearingAndTrialPage.isUnavailableTrailRequired(unavailableTrailRequired),
  () => hearingAndTrialPage.selectSupportRequirement(supportRequirement),
];

const updateHearingDetails = () => [
  () => hearingAndTrialPage.updateHearingDetails(),
];

const selectPbaNumber = (consentCheck) => [
  () => gaPBANumberPage.selectPbaNumber('activeAccount1', consentCheck),
];

const verifyCheckAnswerForm = (caseId, consentCheck) => [
  () => answersPage.verifyCheckAnswerForm(caseId, consentCheck),
];

const clickOnHearingDetailsChangeLink = (consentCheck) => [
  () => answersPage.clickOnChangeLink(consentCheck),
];

const submitApplication = () => [
  () => event.submit('Submit', 'You have made an application')
];

const verifyGAConfirmationPage = (appType) => [
  () => confirmationPage.verifyConfirmationPage(),
  () => confirmationPage.verifyApplicationType(appType)
];

const clickOnTab = (tabName) => [
  () => caseViewPage.clickOnTab(tabName)
];

module.exports = function () {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    async login(user) {
      if (await this.hasSelector(SIGNED_IN_SELECTOR)) {
        await this.signOut();
      }

      await this.retryUntilExists(async () => {
        this.amOnPage(config.url.manageCase, 60);

        if (!config.idamStub.enabled || config.idamStub.enabled === 'false') {
          output.log(`Signing in user: ${user.type}`);
          await loginPage.signIn(user);
        }
      }, SIGNED_IN_SELECTOR);
    },

    grabCaseNumber: async function () {
      this.waitForElement(CASE_HEADER);

      return await this.grabTextFrom(CASE_HEADER);
    },

    async signOut() {
      await this.retryUntilExists(() => {
        this.click('Sign out');
      }, SIGNED_OUT_SELECTOR);
    },

    async takeScreenshot() {
      if (currentEventName !== eventName) {
        currentEventName = eventName;
        eventNumber++;
        screenshotNumber = 0;
      }
      screenshotNumber++;
      await this.saveScreenshot(getScreenshotName(), true);
    },

    triggerStepsWithScreenshot: async function (steps) {
      for (let i = 0; i < steps.length; i++) {
        try {
          await this.takeScreenshot();
        } catch {
          output.log(`Error taking screenshot: ${getScreenshotName()}`);
        }
        await steps[i]();
      }
    },

    async createCase(litigantInPerson = false) {
      eventName = 'Create case';

      await createCasePage.createCase(config.definition.jurisdiction);
      await this.triggerStepsWithScreenshot([
        () => continuePage.continue(),
        () => solicitorReferencesPage.enterReferences(),
        () => chooseCourtPage.enterCourt(),
        () => party.enterParty('applicant1', address),
        () => claimantLitigationDetails.enterLitigantFriendWithDifferentAddressToApplicant(address, TEST_FILE_PATH),
        () => claimantSolicitorIdamDetailsPage.enterUserEmail(),
        () => claimantSolicitorOrganisation.enterOrganisationDetails(),
        () => claimantSolicitorServiceAddress.enterOrganisationServiceAddress(),
        () => addAnotherClaimant.enterAddAnotherClaimant(),
        () => party.enterParty('respondent1', address),
        () => respondentRepresentedPage.enterRespondentRepresented('respondent1', 'no'),
        () => respondentRepresentedPage.enterRespondentRepresented('respondent1', 'yes'),
        () => defendantSolicitorOrganisation.enterOrganisationDetails('1'),
        () => defendantSolicitorServiceAddress.enterOrganisationServiceAddress(),
        () => defendantSolicitorEmail.enterSolicitorEmail('1'),
        () => addAnotherDefendant.enterAddAnotherDefendant(),
        () => party.enterParty('respondent2', address),
        () => respondentRepresentedPage.enterRespondentRepresented('respondent2', 'yes'),
        () => respondent2SameLegalRepresentative.enterRespondent2SameLegalRepresentative(),
        () => defendantSolicitorOrganisation.enterOrganisationDetails('2'),
        () => secondDefendantSolicitorServiceAddress.enterOrganisationServiceAddress(),
        () => secondDefendantSolicitorReference.enterReference(),
        () => defendantSolicitorEmail.enterSolicitorEmail('2'),
        () => claimTypePage.selectClaimType(),
        () => personalInjuryTypePage.selectPersonalInjuryType(),
        () => detailsOfClaimPage.enterDetailsOfClaim(),
        () => uploadParticularsOfClaimQuestion.chooseYesUploadParticularsOfClaim(),
        () => uploadParticularsOfClaim.upload(TEST_FILE_PATH),
        () => claimValuePage.enterClaimValue(),
        () => pbaNumberPage.selectPbaNumber(),
        () => paymentReferencePage.updatePaymentReference(),
        () => statementOfTruth.enterNameAndRole('claim'),
        () => event.submit('Submit', litigantInPerson ?
          'Your claim has been received and will progress offline' : 'Your claim has been received\nClaim number: '),
        () => event.returnToCaseDetails()
      ]);

      caseId = (await this.grabCaseNumber()).split('-').join('').substring(1);
    },

    async notifyClaim() {
      eventName = 'Notify claim';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => continuePage.continue(),
        () => event.submit('Submit', 'Notification of claim sent'),
        () => event.returnToCaseDetails()
      ]);
    },

    async notifyClaimDetails() {
      eventName = 'Notify claim details';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => continuePage.continue(),
        () => event.submit('Submit', 'Defendant notified'),
        () => event.returnToCaseDetails()
      ]);
    },

    async acknowledgeClaim(responseIntention) {
      eventName = 'Acknowledge claim';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => respondentDetails.verifyDetails(),
        () => responseIntentionPage.selectResponseIntention(responseIntention),
        () => confirmDetailsPage.confirmReference(),
        // temporarily commenting out whilst change is made to service repo
        () => event.submit('Acknowledge claim', ''),
        () => event.returnToCaseDetails()
      ]);
    },

    async informAgreedExtensionDate(respondentSolicitorNumber = '1') {
      eventName = 'Inform agreed extension date';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => extensionDatePage.enterExtensionDate(respondentSolicitorNumber),
        () => event.submit('Submit', 'Extension deadline submitted'),
        () => event.returnToCaseDetails()
      ]);
    },

    async addDefendantLitigationFriend() {
      eventName = 'Add litigation friend';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => defendantLitigationFriendPage.enterLitigantFriendWithDifferentAddressToDefendant(address, TEST_FILE_PATH),
        () => event.submit('Submit', 'You have added litigation friend details'),
        () => event.returnToCaseDetails()
      ]);
    },

    async respondToClaim(responseType) {
      eventName = 'Respond to claim';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => responseTypePage.selectResponseType(responseType),
        ...conditionalSteps(responseType === 'fullDefence', [
          () => uploadResponsePage.uploadResponseDocuments(TEST_FILE_PATH),
          () => respondentDetails.verifyDetails(),
          () => confirmDetailsPage.confirmReference(),
          () => fileDirectionsQuestionnairePage.fileDirectionsQuestionnaire(parties.RESPONDENT_SOLICITOR_1),
          () => disclosureOfElectronicDocumentsPage.enterDisclosureOfElectronicDocuments(parties.RESPONDENT_SOLICITOR_1),
          () => disclosureOfNonElectronicDocumentsPage.enterDirectionsProposedForDisclosure(parties.RESPONDENT_SOLICITOR_1),
          () => expertsPage.enterExpertInformation(parties.RESPONDENT_SOLICITOR_1),
          () => witnessPage.enterWitnessInformation(parties.RESPONDENT_SOLICITOR_1),
          () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => hearingPage.enterHearingInformation(parties.RESPONDENT_SOLICITOR_1),
          () => draftDirectionsPage.upload(parties.RESPONDENT_SOLICITOR_1, TEST_FILE_PATH),
          () => requestedCourtPage.selectSpecificCourtForHearing(parties.RESPONDENT_SOLICITOR_1),
          () => hearingSupportRequirementsPage.selectRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => furtherInformationPage.enterFurtherInformation(parties.RESPONDENT_SOLICITOR_1),
          () => statementOfTruth.enterNameAndRole(parties.RESPONDENT_SOLICITOR_1 + 'DQ'),
        ]),
        () => event.submit('Submit', ''),
        () => event.returnToCaseDetails()
      ]);
    },

    async respondToDefence() {
      eventName = 'View and respond to defence';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => proceedPage.proceedWithClaim(),
        () => uploadResponseDocumentPage.uploadResponseDocuments(TEST_FILE_PATH),
        () => fileDirectionsQuestionnairePage.fileDirectionsQuestionnaire(parties.APPLICANT_SOLICITOR_1),
        () => disclosureOfElectronicDocumentsPage.enterDisclosureOfElectronicDocuments(parties.APPLICANT_SOLICITOR_1),
        () => disclosureOfNonElectronicDocumentsPage.enterDirectionsProposedForDisclosure(parties.APPLICANT_SOLICITOR_1),
        () => expertsPage.enterExpertInformation(parties.APPLICANT_SOLICITOR_1),
        () => witnessPage.enterWitnessInformation(parties.APPLICANT_SOLICITOR_1),
        () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.APPLICANT_SOLICITOR_1),
        () => hearingPage.enterHearingInformation(parties.APPLICANT_SOLICITOR_1),
        () => draftDirectionsPage.upload(parties.APPLICANT_SOLICITOR_1, TEST_FILE_PATH),
        () => hearingSupportRequirementsPage.selectRequirements(parties.APPLICANT_SOLICITOR_1),
        () => furtherInformationPage.enterFurtherInformation(parties.APPLICANT_SOLICITOR_1),
        () => statementOfTruth.enterNameAndRole(parties.APPLICANT_SOLICITOR_1 + 'DQ'),
        () => event.submit('Submit your response', 'You have chosen to proceed with the claim\nClaim number: '),
        () => this.click('Close and Return to case details')
      ]);
      await this.takeScreenshot();
    },

    async respondToDefenceDropClaim() {
      eventName = 'View and respond to defence';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => proceedPage.dropClaim(),
        () => event.submit('Submit your response', 'You have chosen not to proceed with the claim'),
        () => this.click('Close and Return to case details')
      ]);
      await this.takeScreenshot();
    },

    async caseProceedsInCaseman() {
      eventName = 'Case proceeds in Caseman';

      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => caseProceedsInCasemanPage.enterTransferDate(),
        () => takeCaseOffline.takeCaseOffline()
      ]);
      await this.takeScreenshot();
    },

    async assertNoEventsAvailable() {
      await caseViewPage.assertNoEventsAvailable();
    },

    async clickContinue() {
      let urlBefore = await this.grabCurrentUrl();
      await this.retryUntilUrlChanges(() => this.click('Continue'), urlBefore);
    },

    /**
     * Retries defined action util element described by the locator is invisible. If element is not invisible
     * after 4 tries (run + 3 retries) this step throws an error. Use cases include checking no error present on page.
     *
     * Warning: action logic should avoid framework steps that stop test execution upon step failure as it will
     *          stop test execution even if there are retries still available. Catching step error does not help.
     *
     * @param action - an action that will be retried until either condition is met or max number of retries is reached
     * @param locator - locator for an element that is expected to be invisible upon successful execution of an action
     * @param maxNumberOfRetries - maximum number to retry the function for before failing
     * @returns {Promise<void>} - promise holding no result if resolved or error if rejected
     */
    async retryUntilInvisible(action, locator, maxNumberOfRetries = 3) {
      for (let tryNumber = 1; tryNumber <= maxNumberOfRetries; tryNumber++) {
        output.log(`retryUntilInvisible(${locator}): starting try #${tryNumber}`);
        await action();

        if (await this.hasSelector(locator) > 0) {
          output.print(`retryUntilInvisible(${locator}): error present after try #${tryNumber} was executed`);
        } else {
          output.log(`retryUntilInvisible(${locator}): error not present after try #${tryNumber} was executed`);
          break;
        }
        if (tryNumber === maxNumberOfRetries) {
          throw new Error(`Maximum number of tries (${maxNumberOfRetries}) has been reached in search for ${locator}`);
        }
      }
    },

    async addAnotherElementToCollection() {
      const numberOfElements = await this.grabNumberOfVisibleElements('.collection-title');
      this.click('Add new');
      this.waitNumberOfVisibleElements('.collection-title', numberOfElements + 1);
    },

    /**
     * Retries defined action util element described by the locator is present. If element is not present
     * after 4 tries (run + 3 retries) this step throws an error.
     *
     * Warning: action logic should avoid framework steps that stop test execution upon step failure as it will
     *          stop test execution even if there are retries still available. Catching step error does not help.
     *
     * @param action - an action that will be retried until either condition is met or max number of retries is reached
     * @param locator - locator for an element that is expected to be present upon successful execution of an action
     * @param maxNumberOfTries - maximum number to retry the function for before failing
     * @returns {Promise<void>} - promise holding no result if resolved or error if rejected
     */
    async retryUntilExists(action, locator, maxNumberOfTries = 6) {
      for (let tryNumber = 1; tryNumber <= maxNumberOfTries; tryNumber++) {
        output.log(`retryUntilExists(${locator}): starting try #${tryNumber}`);
        if (tryNumber > 1 && await this.hasSelector(locator)) {
          output.log(`retryUntilExists(${locator}): element found before try #${tryNumber} was executed`);
          break;
        }
        await action();
        if (await this.waitForSelector(locator) != null) {
          output.log(`retryUntilExists(${locator}): element found after try #${tryNumber} was executed`);
          break;
        } else {
          output.print(`retryUntilExists(${locator}): element not found after try #${tryNumber} was executed`);
        }
        if (tryNumber === maxNumberOfTries) {
          throw new Error(`Maximum number of tries (${maxNumberOfTries}) has been reached in search for ${locator}`);
        }
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retries defined action util url is changed by given action. If url does not change
     * after 4 tries (run + 3 retries) this step throws an error. If url is already changed, will exit.
     *
     * Warning: action logic should avoid framework steps that stop test execution upon step failure as it will
     *          stop test execution even if there are retries still available. Catching step error does not help.
     *
     * @param action - an action that will be retried until either condition is met or max number of retries is reached
     * @param urlBefore - the url before the action has occurred
     * @param maxNumberOfTries - maximum number to retry the function for before failing
     * @returns {Promise<void>} - promise holding no result if resolved or error if rejected
     */
    async retryUntilUrlChanges(action, urlBefore, maxNumberOfTries = 6) {
      let urlAfter;
      for (let tryNumber = 1; tryNumber <= maxNumberOfTries; tryNumber++) {
        output.log(`Checking if URL has changed, starting try #${tryNumber}`);
        await action();
        await this.sleep(3000 * tryNumber);
        urlAfter = await this.grabCurrentUrl();
        if (urlBefore !== urlAfter) {
          output.log(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url changed after try #${tryNumber} was executed`);
          break;
        } else {
          output.print(`retryUntilUrlChanges(before: ${urlBefore}, after: ${urlAfter}): url did not change after try #${tryNumber} was executed`);
        }
        if (tryNumber === maxNumberOfTries) {
          throw new Error(`Maximum number of tries (${maxNumberOfTries}) has been reached trying to change urls. Before: ${urlBefore}. After: ${urlAfter}`);
        }
      }
    },

    async createCaseSpec(applicantType, defendantType, litigantInPerson = false, claimAmount) {
      this.click('Create case');
      this.waitForElement(`#cc-jurisdiction > option[value="${config.definition.jurisdiction}"]`);
      await this.retryUntilExists(() => specCreateCasePage.selectCaseType(), 'ccd-markdown');
      await this.clickContinue();
      await this.clickContinue();
      await solicitorReferencesPage.enterReferences();
      await specPartyDetails.enterDetails('applicant1', address, applicantType);
      await claimantSolicitorIdamDetailsPage.enterUserEmail();
      await claimantSolicitorOrganisationLRspec.enterOrganisationDetails();
      await specParty.enterSpecParty('Applicant', specClaimantLRPostalAddress);
      await specPartyDetails.enterDetails('respondent1', address, defendantType);
      if (litigantInPerson) {
        await specRespondentRepresentedPage.enterRespondentRepresented('no');
      } else {
        await specRespondentRepresentedPage.enterRespondentRepresented('yes');
        await defendantSolicitorOrganisationLRspec.enterOrganisationDetails('respondent1');
        await specDefendantSolicitorEmailPage.enterSolicitorEmail();
      }
      await specParty.enterSpecParty('Respondent', specDefendantLRPostalAddress);
      await detailsOfClaimPage.enterDetailsOfClaim();
      await specTimelinePage.addManually();
      await specAddTimelinePage.addTimeline();
      await specListEvidencePage.addEvidence();
      await specClaimAmountPage.addClaimItem(claimAmount);
      await this.clickContinue();
      await specInterestPage.addInterest();
      await specInterestValuePage.selectInterest();
      await specInterestRatePage.selectInterestRate();
      await specInterestDateStartPage.selectInterestDateStart();
      await specInterestDateEndPage.selectInterestDateEnd();
      await this.clickContinue();
      await pbaNumberPage.selectPbaNumber();
      await paymentReferencePage.updatePaymentReference();
      await statementOfTruth.enterNameAndRole('claim');
      let expectedMessage = litigantInPerson ?
        'Your claim has been received and will progress offline' : 'Your claim has been received\nClaim number: ';
      await event.submit('Submit', expectedMessage);
      await event.returnToCaseDetails();
      caseId = (await this.grabCaseNumber()).split('-').join('').substring(1);
    },

    async acknowledgeClaimSpec() {
      eventName = 'Acknowledgement of Service';
      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => specConfirmDefendantsDetails.confirmDetails(),
        () => specConfirmLegalRepDetails.confirmDetails(),
        () => event.submit('Acknowledge claim', ''),
        () => event.returnToCaseDetails()
      ]);
    },

    async respondToClaimSpec(responseType, defenceType, paidAmount) {
      eventName = 'Respond to claim';
      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => respondentCheckListPage.claimTimelineTemplate(),
        () => specConfirmDefendantsDetails.confirmDetails(),
        () => specConfirmLegalRepDetails.confirmDetails(),
        () => responseTypeSpecPage.selectResponseType(responseType),
        ...conditionalSteps(responseType === 'fullDefence', [
          () => defenceTypePage.selectDefenceType(defenceType, paidAmount)
        ]),
        ...conditionalSteps(defenceType === 'hasPaid' && paidAmount === 1000, [
          () => freeMediationPage.selectMediation('yes'),
          () => useExpertPage.claimExpert('no'),
          () => enterWitnessesPage.howManyWitnesses(),
          () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => smallClaimsHearingPage.selectHearing('no'),
          () => chooseCourtSpecPage.chooseCourt('yes'),
        ]),
        ...conditionalSteps(paidAmount < 1000 && (defenceType === 'dispute' || defenceType === 'hasPaid'), [
          () => disputeClaimDetailsPage.enterReasons(),
          () => claimResponseTimelineLRspecPage.addManually(),
          () => this.clickContinue(),
          () => freeMediationPage.selectMediation('yes'),
          () => useExpertPage.claimExpert('no'),
          () => enterWitnessesPage.howManyWitnesses(),
          () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => smallClaimsHearingPage.selectHearing('no'),
          () => chooseCourtSpecPage.chooseCourt('yes'),
        ]),
        ...conditionalSteps(defenceType === 'hasPaid' && paidAmount === 15000, [
          () => fileDirectionsQuestionnairePage.fileDirectionsQuestionnaire(parties.RESPONDENT_SOLICITOR_1),
          () => disclosureOfElectronicDocumentsPage.enterDisclosureOfElectronicDocuments('specRespondent1'),
          () => this.clickContinue(),
          () => disclosureReportPage.enterDisclosureReport(parties.RESPONDENT_SOLICITOR_1),
          () => expertsPage.enterExpertInformation(parties.RESPONDENT_SOLICITOR_1),
          () => witnessPage.enterWitnessInformation(parties.RESPONDENT_SOLICITOR_1),
          () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => hearingLRspecPage.enterHearing(parties.RESPONDENT_SOLICITOR_1),
          () => chooseCourtSpecPage.chooseCourt('yes'),
        ]),
        ...conditionalSteps(paidAmount === 10000 && (defenceType === 'dispute' || defenceType === 'hasPaid'), [
          () => disputeClaimDetailsPage.enterReasons(),
          () => claimResponseTimelineLRspecPage.addManually(),
          () => this.clickContinue(),
          () => fileDirectionsQuestionnairePage.fileDirectionsQuestionnaire(parties.RESPONDENT_SOLICITOR_1),
          () => disclosureOfElectronicDocumentsPage.enterDisclosureOfElectronicDocuments('specRespondent1'),
          () => this.clickContinue(),
          () => disclosureReportPage.enterDisclosureReport(parties.RESPONDENT_SOLICITOR_1),
          () => expertsPage.enterExpertInformation(parties.RESPONDENT_SOLICITOR_1),
          () => witnessPage.enterWitnessInformation(parties.RESPONDENT_SOLICITOR_1),
          () => welshLanguageRequirementsPage.enterWelshLanguageRequirements(parties.RESPONDENT_SOLICITOR_1),
          () => hearingLRspecPage.enterHearing(parties.RESPONDENT_SOLICITOR_1),
          () => chooseCourtSpecPage.chooseCourt('yes'),
        ]),
        () => hearingSupportRequirementsPage.selectRequirements(parties.RESPONDENT_SOLICITOR_1),
        ...conditionalSteps(paidAmount <= 1000 && (defenceType === 'dispute' || defenceType === 'hasPaid'), [
          () => furtherInformationPage.enterFurtherInformation(parties.RESPONDENT_SOLICITOR_1),
        ]),
        ...conditionalSteps(paidAmount >= 10000 && (defenceType === 'dispute' || defenceType === 'hasPaid'), [
          () => furtherInformationLRspecPage.enterFurtherInformation(parties.RESPONDENT_SOLICITOR_1),
        ]),
        () => statementOfTruth.enterNameAndRole(parties.APPLICANT_SOLICITOR_1 + 'DQ'),
        () => event.submit('Submit', ''),
        () => event.returnToCaseDetails()
      ]);
    },

    async navigateToCaseDetails(caseNumber) {
      await this.retryUntilExists(async () => {
        const normalizedCaseId = caseNumber.toString().replace(/\D/g, '');
        console.log(`Navigating to case: ${normalizedCaseId}`);
        await this.amOnPage(`${config.url.manageCase}/cases/case-details/${normalizedCaseId}`);
      }, SIGNED_IN_SELECTOR);

      await this.waitForSelector('.ccd-dropdown');
    },

    async goToGeneralAppScreenAndVerifyAllApps(appTypes, caseNumber, caseId) {
      eventName = events.INITIATE_GENERAL_APPLICATION.name;
      await this.triggerStepsWithScreenshot([
        () => caseViewPage.startEvent(eventName, caseId),
        () => applicationTypePage.verifyAllApplicationTypes(appTypes, caseNumber),
      ]);
    },

    async createGeneralApplication(appTypes, caseId, consentCheck, isUrgent, notice, hearingScheduled, judgeRequired, trialRequired, unavailableTrailRequired, supportRequirement) {
      eventName = events.INITIATE_GENERAL_APPLICATION.name;
      await this.triggerStepsWithScreenshot([
        ...selectApplicationType(eventName, appTypes, caseId),
        ...selectConsentCheck(consentCheck),
        ...isUrgentApplication(isUrgent),
        ...conditionalSteps(consentCheck === 'no', [
          ...selectNotice(notice),
        ]),
        ...enterApplicationDetails(),
        ...fillHearingDetails(hearingScheduled, judgeRequired, trialRequired, unavailableTrailRequired, supportRequirement),
        ...selectPbaNumber(consentCheck),
        ...verifyCheckAnswerForm(caseId, consentCheck),
        ...clickOnHearingDetailsChangeLink(consentCheck),
        ...updateHearingDetails(),
        ...submitApplication(),
        ...verifyGAConfirmationPage(appTypes),
      ]);
    }
  });
};
