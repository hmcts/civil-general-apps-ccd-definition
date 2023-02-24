const {I} = inject();
const {waitForFinishedBusinessProcess, waitForGAFinishedBusinessProcess} = require('../../api/testingSupport');
const config = require('../../config');

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationFeeLink: '#confirmation-body a'
  },

  async verifyConfirmationPage(parentCaseId) {
    I.waitForElement(this.fields.confirmation.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATION/confirm');
    I.seeTextEquals('You have made an application', '#confirmation-header h1');
    I.seeTextEquals('Pay your application fee', this.fields.applicationFeeLink);
    await waitForFinishedBusinessProcess(parentCaseId, config.applicantSolicitorUser);
    await waitForGAFinishedBusinessProcess(parentCaseId, config.applicantSolicitorUser);
  },

  async closeAndReturnToCaseDetails() {
    await I.click('Close and Return to case details');
    await I.see('Make an application');
  }
};

