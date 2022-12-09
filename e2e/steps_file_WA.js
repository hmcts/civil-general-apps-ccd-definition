// in this file you can append custom step methods to 'I' object

const {assert} = require('chai');
const config = require('../e2e/config');
const caseViewPage = require('./pages/caseView.page');

const taskFieldsToBeValidated = {
  taskInitiationFields: [
    'name',
    'type',
    'task_title',
  ],
  taskConfigurationFields: [
    'location_name',
    'location',
    'execution_type',
    'jurisdiction',
    'region',
    'case_type_id',
    'case_category',
    'auto_assigned',
    'case_management_category',
    'work_type_id',
    'work_type_label',
    'description',
    'role_category'
  ],
  taskPermissionFields: [
    'permissions'
  ]
};


module.exports = function () {
  return actor({
    goToTask: async function (caseId, taskName) {
      await this.amOnPage(config.url.manageCase + '/cases/case-details/' + caseId + '/tasks');
      await this.waitForElement('#event');
      await this.click('#action_claim');
      await this.waitForElement('#action_reassign');
      await this.waitForText(taskName);
      await this.click(taskName);
      await this.wait(3);
      if (taskName === 'JudgeDecideOnApplication') {
        await this.waitInUrl('MAKE_DECISIONGAJudicialDecision', 10);
      } else if (taskName === 'LegalAdvisorDecideOnApplication') {
        await this.waitInUrl('MAKE_DECISIONGAJudicialDecision', 10);
      } else {
        await this.waitInUrl('Summary', 5);
      }
    },

    goToAdminTask: async function (caseId) {
      await this.amOnPage(config.url.manageCase + '/cases/case-details/' + caseId + '/tasks');
      await this.waitForElement('#event');
      await this.click('#action_claim');
      await this.waitForElement('#action_reassign');
      // Enable this after implementation
      // await this.waitForText(taskName);
      await this.see('Active tasks');
      await this.see('Next steps');
    },

    verifyNoActiveTask: async function (caseId) {
      await this.amOnPage(config.url.manageCase + '/cases/case-details/' + caseId + '/tasks');
      await this.dontSeeElement('#action_claim');
    },

    goToEvent: async function (eventName) {
      await caseViewPage.start(eventName);
    },

    referToJudge: async function () {
      await this.waitInUrl('REFER_TO_JUDGE');
      await this.fillField('#referToJudge_judgeReferEventDescription', 'Test test');
      await this.fillField('#referToJudge_judgeReferAdditionalInfo', 'Test additional Info');
      await this.click('Continue');
      await this.waitInUrl('REFER_TO_JUDGE/submit', 5);
      await this.click('Submit');
      await this.wait(5);
    },

    referToLA: async function () {
      await this.waitInUrl('REFER_TO_LEGAL_ADVISOR');
      await this.fillField('#referToLegalAdvisor_legalAdvisorEventDescription', 'Test test');
      await this.fillField('#referToLegalAdvisor_legalAdvisorAdditionalInfo', 'Test additional Info');
      await this.click('Continue');
      await this.waitInUrl('REFER_TO_LEGAL_ADVISOR/submit', 5);
      await this.click('Submit');
    },

    runChallengedAccessSteps: async function(userId, caseId) {
      await I.login(userId);
      await this.click('Search');
      await this.waitForElement('#caseRef');
      await this.fillField('#caseRef', caseId);
      await this.click('//button[@type=\'submit\']');
      await this.waitForText(caseId);
      await this.waitForClickable('//a[contains(text(), \'Challenged access\')]', 60);
      await this.click('Challenged access');
      await this.waitForText('To determine if the case needs to be consolidated');
      await this.click('#reason-1');
      await this.click('Submit');
      await this.waitForText('Access successful');
      await this.see(caseId);
      await this.click('View case file');
    },

    validateTaskInfo(createdTask, expectedTaskInfo) {
      if(expectedTaskInfo && createdTask) {
        for (let taskDMN of Object.keys(taskFieldsToBeValidated)) {
          console.log(`asserting dmn info: ${taskDMN} has valid data`);
          taskFieldsToBeValidated[taskDMN].forEach(
            fieldsToBeValidated  => {
              assert.deepEqual(createdTask[fieldsToBeValidated], expectedTaskInfo[fieldsToBeValidated]);
            }
          );
        }
      }
    }
  });
};
