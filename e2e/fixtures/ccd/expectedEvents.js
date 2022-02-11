const events = require('./events.js');

module.exports = {
  applicant_solicitor: {
    CASE_ISSUED: [
      events.NOTIFY_DEFENDANT_OF_CLAIM,
      events.ADD_OR_AMEND_CLAIM_DOCUMENTS
    ],
    AWAITING_CASE_DETAILS_NOTIFICATION: [
      events.NOTIFY_DEFENDANT_OF_CLAIM_DETAILS,
      events.ADD_OR_AMEND_CLAIM_DOCUMENTS
    ],
    AWAITING_RESPONDENT_ACKNOWLEDGEMENT: [
    ],
    PROCEEDS_IN_HERITAGE_SYSTEM: [],
    AWAITING_APPLICANT_INTENTION: [
      events.CLAIMANT_RESPONSE,
    ],
    PENDING_CASE_ISSUED: [
      events.RESUBMIT_CLAIM,
      events.NOTIFY_DEFENDANT_OF_CLAIM
    ]
  },
  defendant_solicitor: {
    AWAITING_CASE_DETAILS_NOTIFICATION: [],
    AWAITING_RESPONDENT_ACKNOWLEDGEMENT: [
      events.ACKNOWLEDGE_CLAIM,
      events.DEFENDANT_RESPONSE,
      events.INFORM_AGREED_EXTENSION_DATE,
      events.ADD_DEFENDANT_LITIGATION_FRIEND
    ],
    PROCEEDS_IN_HERITAGE_SYSTEM: [],
    AWAITING_APPLICANT_INTENTION: [
      events.ADD_DEFENDANT_LITIGATION_FRIEND
    ],
  },
  admin: {
    CASE_ISSUED: [
      events.CASE_PROCEEDS_IN_CASEMAN,
      events.AMEND_PARTY_DETAILS,
      events.ADD_CASE_NOTE
    ],
    AWAITING_CASE_DETAILS_NOTIFICATION: [
      events.CASE_PROCEEDS_IN_CASEMAN,
      events.AMEND_PARTY_DETAILS,
      events.ADD_CASE_NOTE
    ],
    AWAITING_RESPONDENT_ACKNOWLEDGEMENT: [
      events.CASE_PROCEEDS_IN_CASEMAN,
      events.AMEND_PARTY_DETAILS,
      events.ADD_CASE_NOTE
    ],
    PROCEEDS_IN_HERITAGE_SYSTEM: [
      events.AMEND_PARTY_DETAILS
    ],
    AWAITING_APPLICANT_INTENTION: [
      events.CASE_PROCEEDS_IN_CASEMAN,
      events.AMEND_PARTY_DETAILS,
      events.ADD_CASE_NOTE
    ],
    PENDING_CASE_ISSUED: [
      events.AMEND_PARTY_DETAILS
    ]
  }
};
