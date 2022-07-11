const {I} = inject();
const {waitForFinishedBusinessProcess, waitForGAFinishedBusinessProcess} = require('../../api/testingSupport');

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationList: '#confirmation-body li'
  },

  async verifyConfirmationPage() {
    I.waitForElement(this.fields.confirmation.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATION/confirm');
    I.seeTextEquals('You have made an application', '#confirmation-header h1');
  },

  async verifyApplicationType(appTypes, parentCaseId) {
    I.waitForElement(this.fields.confirmation.id);
    appTypes.forEach(type => {
      return I.see(type);
    });
    await waitForFinishedBusinessProcess(parentCaseId);
    await waitForGAFinishedBusinessProcess(parentCaseId);
  },

  async closeAndReturnToCaseDetails(caseId) {
    await I.see(caseId);
    await I.click('Close and Return to case details');
    await I.waitForInvisible(locate('.loading-spinner-in-action').withText('Loading'), 5);
    //await I.see(`Case ${caseId} has been updated with event: Make an application`);
  }
};

