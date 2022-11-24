const config = require('../config.js');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');

chai.use(deepEqualInAnyOrder);
chai.config.truncateThreshold = 0;
const {assert} = chai;

const {
  createClaimWithRepresentedRespondent,
  claimantResponse,
  amendClaimDocuments,
  notifyClaim,
  notifyClaimDetails,
  acknowledgeClaim,
  defendantResponse
} = require('../api/steps.js');
const {waitForFinishedBusinessProcess} = require('../api/testingSupport');
const {addUserCaseMapping} = require('./caseRoleAssignmentHelper');
const apiRequest = require('./apiRequest.js');
const claimDataSpec = require('../fixtures/events/createClaimSpec.js');
const claimData = require('../fixtures/events/createClaim.js');
const sdoTracks = require('../fixtures/events/createSDO.js');
const claimResponse = require('../fixtures/events/claimantResponse');

let caseId, eventName, responseData;
let caseData = {};

const data = {
  CREATE_CLAIM_SPEC: (scenario) => claimDataSpec.createClaim(scenario),
  DEFENDANT_RESPONSE_SPEC: (response) => require('../fixtures/events/defendantResponseSpec.js').respondToClaim(response),
  DEFENDANT_RESPONSE2_SPEC: (response) => require('../fixtures/events/defendantResponseSpec.js').respondToClaim2(response),
  DEFENDANT_RESPONSE_1v2_SPEC: (response) => require('../fixtures/events/defendantResponseSpec1v2.js').respondToClaim(response),
  DEFENDANT_RESPONSE_2v1_SPEC: (response) => require('../fixtures/events/defendantResponseSpec2v1.js').respondToClaim(response),
  CLAIMANT_RESPONSE_SPEC: (mpScenario) => require('../fixtures/events/claimantResponseSpec.js').claimantResponse(mpScenario),
  CLAIMANT_RESPONSE_1v2_SPEC: (response) => require('../fixtures/events/claimantResponseSpec1v2.js').claimantResponse(response),
  CLAIMANT_RESPONSE_2v1_SPEC: (response) => require('../fixtures/events/claimantResponseSpec2v1.js').claimantResponse(response),

  CREATE_CLAIM: (mpScenario) => claimData.createClaim(mpScenario),
  NOTIFY_DEFENDANT_OF_CLAIM: require('../fixtures/events/1v2DifferentSolicitorEvents/notifyClaim_1v2DiffSol.js'),
  NOTIFY_DEFENDANT_OF_CLAIM_DETAILS: require('../fixtures/events/1v2DifferentSolicitorEvents/notifyClaim_1v2DiffSol.js'),
  ACKNOWLEDGE_CLAIM: require('../fixtures/events/acknowledgeClaim.js'),
  ACKNOWLEDGE_CLAIM_SAME_SOLICITOR: require('../fixtures/events/1v2SameSolicitorEvents/acknowledgeClaim_sameSolicitor.js'),
  ACKNOWLEDGE_CLAIM_SOLICITOR_ONE: require('../fixtures/events/1v2DifferentSolicitorEvents/acknowledgeClaim_Solicitor1.js'),
  ACKNOWLEDGE_CLAIM_SOLICITOR_TWO: require('../fixtures/events/1v2DifferentSolicitorEvents/acknowledgeClaim_Solicitor2.js'),
  DEFENDANT_RESPONSE: require('../fixtures/events/defendantResponse.js'),
  DEFENDANT_RESPONSE_SAME_SOLICITOR: require('../fixtures/events/1v2SameSolicitorEvents/defendantResponse_sameSolicitor.js'),
  DEFENDANT_RESPONSE_SOLICITOR_ONE: require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor1'),
  DEFENDANT_RESPONSE_SOLICITOR_TWO: require('../fixtures/events/1v2DifferentSolicitorEvents/defendantResponse_Solicitor2'),
  DEFENDANT_RESPONSE_TWO_APPLICANTS: require('../fixtures/events/2v1Events/defendantResponse_2v1'),
  CLAIMANT_RESPONSE: (mpScenario) => claimResponse.claimantResponse(mpScenario),

  CREATE_DISPOSAL: (userInput) => sdoTracks.createSDODisposal(userInput),
  CREATE_FAST: (userInput) => sdoTracks.createSDOFast(userInput),
  CREATE_SMALL: (userInput) => sdoTracks.createSDOSmall(userInput),
  CREATE_FAST_NO_SUM: (userInput) => sdoTracks.createSDOFastWODamageSum(userInput),
  CREATE_SMALL_NO_SUM: (userInput) => sdoTracks.createSDOSmallWODamageSum(userInput),
  UNSUITABLE_FOR_SDO: (userInput) => sdoTracks.createNotSuitableSDO(userInput),
  INFORM_AGREED_EXTENSION_DATE: () => require('../fixtures/events/informAgreeExtensionDateSpec.js')
};

const eventData = {
  defendantResponses: {
    ONE_V_ONE: {
      FULL_DEFENCE: data.DEFENDANT_RESPONSE_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.DEFENDANT_RESPONSE_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.DEFENDANT_RESPONSE_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM: data.DEFENDANT_RESPONSE_SPEC('COUNTER_CLAIM')
    },
    ONE_V_TWO: {
      FULL_DEFENCE: data.DEFENDANT_RESPONSE_1v2_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.DEFENDANT_RESPONSE_1v2_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.DEFENDANT_RESPONSE_1v2_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM: data.DEFENDANT_RESPONSE_1v2_SPEC('COUNTER_CLAIM'),
      DIFF_FULL_DEFENCE: data.DEFENDANT_RESPONSE_1v2_SPEC('DIFF_FULL_DEFENCE'),
      DIFF_NOT_FULL_DEFENCE: data.DEFENDANT_RESPONSE_1v2_SPEC('DIFF_NOT_FULL_DEFENCE')
    },
    ONE_V_ONE_DIF_SOL: {
      FULL_DEFENCE1: data.DEFENDANT_RESPONSE_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION1: data.DEFENDANT_RESPONSE_SPEC('FULL_ADMISSION'),
      PART_ADMISSION1: data.DEFENDANT_RESPONSE_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM1: data.DEFENDANT_RESPONSE_SPEC('COUNTER_CLAIM'),

      FULL_DEFENCE2: data.DEFENDANT_RESPONSE2_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION2: data.DEFENDANT_RESPONSE2_SPEC('FULL_ADMISSION'),
      PART_ADMISSION2: data.DEFENDANT_RESPONSE2_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM2: data.DEFENDANT_RESPONSE2_SPEC('COUNTER_CLAIM')
    },
    TWO_V_ONE: {
      FULL_DEFENCE: data.DEFENDANT_RESPONSE_2v1_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.DEFENDANT_RESPONSE_2v1_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.DEFENDANT_RESPONSE_2v1_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM: data.DEFENDANT_RESPONSE_2v1_SPEC('COUNTER_CLAIM'),
      DIFF_FULL_DEFENCE: data.DEFENDANT_RESPONSE_2v1_SPEC('DIFF_FULL_DEFENCE'),
      DIFF_NOT_FULL_DEFENCE: data.DEFENDANT_RESPONSE_2v1_SPEC('DIFF_NOT_FULL_DEFENCE')
    }
  },
  claimantResponses: {
    ONE_V_ONE: {
      FULL_DEFENCE: data.CLAIMANT_RESPONSE_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.CLAIMANT_RESPONSE_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.CLAIMANT_RESPONSE_SPEC('PART_ADMISSION'),
      COUNTER_CLAIM: data.CLAIMANT_RESPONSE_SPEC('COUNTER_CLAIM')
    },
    ONE_V_TWO: {
      FULL_DEFENCE: data.CLAIMANT_RESPONSE_1v2_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.CLAIMANT_RESPONSE_1v2_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.CLAIMANT_RESPONSE_1v2_SPEC('PART_ADMISSION'),
      NOT_PROCEED: data.CLAIMANT_RESPONSE_1v2_SPEC('NOT_PROCEED'),
    },
    TWO_V_ONE: {
      FULL_DEFENCE: data.CLAIMANT_RESPONSE_2v1_SPEC('FULL_DEFENCE'),
      FULL_ADMISSION: data.CLAIMANT_RESPONSE_2v1_SPEC('FULL_ADMISSION'),
      PART_ADMISSION: data.CLAIMANT_RESPONSE_2v1_SPEC('PART_ADMISSION'),
      NOT_PROCEED: data.CLAIMANT_RESPONSE_2v1_SPEC('NOT_PROCEED')
    }
  },
  sdoTracks: {
    CREATE_DISPOSAL: data.CREATE_DISPOSAL(responseData),
    CREATE_SMALL: data.CREATE_SMALL(responseData),
    CREATE_FAST: data.CREATE_FAST(responseData),
    CREATE_SMALL_NO_SUM: data.CREATE_SMALL_NO_SUM(responseData),
    CREATE_FAST_NO_SUM: data.CREATE_FAST_NO_SUM(responseData),
    UNSUITABLE_FOR_SDO: data.UNSUITABLE_FOR_SDO(responseData)
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

  unspecifiedProcess: async (user1 = config.applicantSolicitorUser,
                             user2 = config.defendantSolicitorUser,
                             scenario = 'ONE_V_ONE') => {
    const createData = claimData.createClaim(scenario);
    delete createData.invalid;
    await createClaimWithRepresentedRespondent(user1, scenario, createData);
    await amendClaimDocuments(config.applicantSolicitorUser);
    await notifyClaim(user1, scenario);
    await notifyClaimDetails(user1);
    await acknowledgeClaim(user2, scenario);
    caseId = await defendantResponse(user2, scenario);
    await claimantResponse(user1, scenario, 'AWAITING_APPLICANT_INTENTION', 'JUDICIAL_REFERRAL');
  },

  defendantResponseSPEC: async (user, response = 'FULL_DEFENCE', scenario = 'ONE_V_ONE',
                                expectedEvent = 'AWAITING_APPLICANT_INTENTION') => {
    await apiRequest.setupTokens(user);
    eventName = 'DEFENDANT_RESPONSE_SPEC';

    let returnedCaseData = await apiRequest.startEvent(eventName, caseId);

    let defendantResponseData = eventData['defendantResponses'][scenario][response];

    caseData = returnedCaseData;

    console.log(`${response} ${scenario}`);

    for (let pageId of Object.keys(defendantResponseData.userInput)) {
      await assertValidData(defendantResponseData, pageId);
    }

    switch (scenario) {
      case 'ONE_V_ONE_DIF_SOL':
        /* when camunda process is done, when both respondents have answered
        this should be AWAITING_APPLICANT_INTENTION; while only one has answered
        this will be AWAITING_RESPONDENT_ACKNOWLEDGEMENT
         */
        await assertSubmittedEvent(expectedEvent);
        break;
      case 'ONE_V_ONE':
        await assertSubmittedEvent('AWAITING_APPLICANT_INTENTION');
        break;
      case 'ONE_V_TWO':
        await assertSubmittedEvent('AWAITING_APPLICANT_INTENTION');
        break;
      case 'TWO_V_ONE':
        if (response === 'DIFF_FULL_DEFENCE') {
          await assertSubmittedEvent('PROCEEDS_IN_HERITAGE_SYSTEM');
        } else {
          await assertSubmittedEvent('AWAITING_APPLICANT_INTENTION');
        }
        break;
    }

    await waitForFinishedBusinessProcess(caseId);

    deleteCaseFields('respondent1Copy');
  },

  claimantResponseSPEC:  async (user, response = 'FULL_DEFENCE', scenario = 'ONE_V_ONE',
                                expectedEndState) => {
    // workaround
    deleteCaseFields('applicantSolicitor1ClaimStatementOfTruth');
    deleteCaseFields('respondentResponseIsSame');

    await apiRequest.setupTokens(user);

    eventName = 'CLAIMANT_RESPONSE_SPEC';
    caseData = await apiRequest.startEvent(eventName, caseId);
    let claimantResponseData = eventData['claimantResponses'][scenario][response];

    for (let pageId of Object.keys(claimantResponseData.userInput)) {
      await assertValidData(claimantResponseData, pageId);
    }

    let validState = expectedEndState || 'PROCEEDS_IN_HERITAGE_SYSTEM';
    if (['preview', 'demo'].includes(config.runningEnv) && (response == 'FULL_DEFENCE' || response == 'NOT_PROCEED')) {
      validState = 'JUDICIAL_REFERRAL';
    }

    await assertSubmittedEvent(validState || 'PROCEEDS_IN_HERITAGE_SYSTEM');

    await waitForFinishedBusinessProcess(caseId);
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createSDO: async (informedCaseId, user, response = 'CREATE_DISPOSAL') => {

    console.log('Informed Case Id ' + informedCaseId);
    if (informedCaseId) {
      caseId = informedCaseId;
    }
    await apiRequest.setupTokens(user);

    if (response === 'UNSUITABLE_FOR_SDO') {
      eventName = 'NotSuitable_SDO';
    } else {
      eventName = 'CREATE_SDO';
    }
    caseData = await apiRequest.startEvent(eventName, caseId);
    if (eventData['sdoTracks']) {
      console.log('sdo tracks '+ response + ' does not exist');
    } else {
      console.log('sdo tracks response does not exist');
    }
    let disposalData = eventData['sdoTracks'][response];

    for (let pageId of Object.keys(disposalData.userInput)) {
      await assertValidData(disposalData, pageId);
    }
    await assertSubmittedEvent('CASE_PROGRESSION');
  },
};

// Functions

const assertValidData = async (data, pageId) => {
  console.log(`asserting page: ${pageId} has valid data`);

  const userData = data.userInput[pageId];
  caseData = update(caseData, userData);
  const response = await apiRequest.validatePage(
    eventName,
    pageId,
    caseData,
    caseId
  );
  let responseBody = await response.json();

  assert.equal(response.status, 200);

  if (data.midEventData && data.midEventData[pageId]) {
    checkExpected(responseBody.data, data.midEventData[pageId]);
  }

  if (data.midEventGeneratedData && data.midEventGeneratedData[pageId]) {
    checkGenerated(responseBody.data, data.midEventGeneratedData[pageId]);
  }

  caseData = update(caseData, responseBody.data);
};

function checkExpected(responseBodyData, expected, prefix = '') {
  if (!(responseBodyData) && expected) {
    if (expected) {
      assert.fail('Response' + prefix ? '[' + prefix + ']' : '' + ' is empty but it was expected to be ' + expected);
    } else {
      // null and undefined may reach this point bc typeof null is object
      return;
    }
  }
  for (const key in expected) {
    if (Object.prototype.hasOwnProperty.call(expected, key)) {
      if (typeof expected[key] === 'object') {
        checkExpected(responseBodyData[key], expected[key], key + '.');
      } else {
        assert.equal(responseBodyData[key], expected[key], prefix + key + ': expected ' + expected[key]
          + ' but actual ' + responseBodyData[key]);
      }
    }
  }
}

function checkGenerated(responseBodyData, generated, prefix = '') {
  if (!(responseBodyData)) {
    assert.fail('Response' + prefix ? '[' + prefix + ']' : '' + ' is empty but it was not expected to be');
  }
  for (const key in generated) {
    if (Object.prototype.hasOwnProperty.call(generated, key)) {
      const checkType = function (type) {
        if (type === 'array') {
          assert.isTrue(Array.isArray(responseBodyData[key]),
            'responseBody[' + prefix + key + '] was expected to be an array');
        } else {
          assert.equal(typeof responseBodyData[key], type,
            'responseBody[' + prefix + key + '] was expected to be of type ' + type);
        }
      };
      const checkFunction = function (theFunction) {
        assert.isTrue(theFunction.call(responseBodyData[key], responseBodyData[key]),
          'responseBody[' + prefix + key + '] does not satisfy the condition it should');
      };
      if (typeof generated[key] === 'string') {
        checkType(generated[key]);
      } else if (typeof generated[key] === 'function') {
        checkFunction(generated[key]);
      } else if (typeof generated[key] === 'object') {
        if (generated[key]['type']) {
          checkType(generated[key]['type']);
        }
        if (generated[key]['condition']) {
          checkType(generated[key]['condition']);
        }
        for (const key2 in generated[key]) {
          if (Object.prototype.hasOwnProperty.call(generated, key2) && 'condition' !== key2 && 'type' !== key2) {
            checkGenerated(responseBodyData[key2], generated[key2], key2 + '.');
          }
        }
      }
    }
  }
}

/**
 * {...obj1, ...obj2} replaces elements. For instance, if obj1 = { check : { correct : false }}
 * and obj2 = { check: { newValue : 'ASDF' }} the result will be { check : {newValue : 'ASDF} }.
 *
 * What this method does is a kind of deep spread, in a case like the one before,
 * @param currentObject the object we want to modify
 * @param modifications the object holding the modifications
 * @return a caseData with the new values
 */
function update(currentObject, modifications) {
  const modified = {...currentObject};
  for (const key in modifications) {
    if (currentObject[key] && typeof currentObject[key] === 'object') {
      if (Array.isArray(currentObject[key])) {
        modified[key] = modifications[key];
      } else {
        modified[key] = update(currentObject[key], modifications[key]);
      }
    } else {
      modified[key] = modifications[key];
    }
  }
  return modified;
}

const assertSubmittedEvent = async (expectedState, submittedCallbackResponseContains, hasSubmittedCallback = true) => {
  await apiRequest.startEvent(eventName, caseId);

  const response = await apiRequest.submitEvent(eventName, caseData, caseId);
  const responseBody = await response.json();
  assert.equal(response.status, 201);
  // assert.equal(responseBody.state, expectedState);
  if (hasSubmittedCallback && submittedCallbackResponseContains) {
    assert.equal(responseBody.callback_response_status_code, 200);
    assert.include(responseBody.after_submit_callback_response.confirmation_header, submittedCallbackResponseContains.header);
    assert.include(responseBody.after_submit_callback_response.confirmation_body, submittedCallbackResponseContains.body);
  }

  if (eventName === 'CREATE_CLAIM_SPEC') {
    caseId = responseBody.id;
    await addUserCaseMapping(caseId, config.applicantSolicitorUser);
    console.log('Case created: ' + caseId);
  }
};

// Mid event will not return case fields that were already filled in another event if they're present on currently processed event.
// This happens until these case fields are set again as a part of current event (note that this data is not removed from the case).
// Therefore these case fields need to be removed from caseData, as caseData object is used to make assertions
const deleteCaseFields = (...caseFields) => {
  caseFields.forEach(caseField => delete caseData[caseField]);
};
