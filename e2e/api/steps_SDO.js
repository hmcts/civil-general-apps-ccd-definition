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
  CLAIMANT_RESPONSE_SPEC: (mpScenario) => require('../fixtures/events/claimantResponseSpec.js').claimantResponse(mpScenario),

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
  sdoTracks: {
    CREATE_DISPOSAL: data.CREATE_DISPOSAL(responseData),
    CREATE_SMALL: data.CREATE_SMALL(responseData),
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
