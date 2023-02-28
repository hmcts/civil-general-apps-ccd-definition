const {I} = inject();
const {waitForFinishedBusinessProcess, waitForGAFinishedBusinessProcess} = require('../../api/testingSupport');
const config = require('../../config');
const {expect} = require("chai");

module.exports = {

  fields: {
    confirmation: {
      id: '#confirmation-body'
    },
    applicationFeeLink: '#confirmation-body a'
  },

  async verifyConfirmationPage(parentCaseId, consentCheck, notice) {
    let fee;
    if ('no' === consentCheck && 'yes' === notice) {
      fee = '£275';
    } else {
      fee = '£108';
    }

    let confirmation_msg = `Your application fee of ${fee} is now due for payment.
     Your application will not be reviewed by the court until this fee has been paid.`

    I.waitForElement(this.fields.confirmation.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATION/confirm');
    I.see(confirmation_msg);
    I.see('To pay this fee, you will need to open your application ' +
      'from the Applications tab of this case listing.');
    I.seeTextEquals('Pay your application fee', this.fields.applicationFeeLink);
    await waitForFinishedBusinessProcess(parentCaseId, config.applicantSolicitorUser);
    await waitForGAFinishedBusinessProcess(parentCaseId, config.applicantSolicitorUser);
  },

  async closeAndReturnToCaseDetails() {
    await I.click('Close and Return to case details');
    await I.see('Make an application');
  }
};

