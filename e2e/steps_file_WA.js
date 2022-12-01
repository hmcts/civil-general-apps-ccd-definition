// in this file you can append custom step methods to 'I' object

const { assert} = require('chai');
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


module.exports = function (){
  return actor({
    goToTask: async function(caseId, taskName) {
      await this.amOnPage(config.url.manageCase + '/cases/case-details/' + caseId + '/tasks');
      await this.waitForElement('#event');
      await this.click('#action_claim');
      await this.waitForElement('#action_reassign');
      await this.waitForText(taskName);
      await this.click(taskName);
      await this.waitInUrl('Summary', 5);
    },

    verifyNoActiveTask: async function(caseId, eventName) {
      await this.amOnPage(config.url.manageCase + '/cases/case-details/' + caseId + '/tasks');
      await this.dontSeeElement('#action_claim');
      await this.goToEvent(eventName);
      await this.see('No task available');
    },

    goToEvent: async function(eventName) {
      await caseViewPage.start(eventName);
    },

    referToJudge: async function() {
      await this.waitInUrl('REFER_TO_JUDGE');
      await this.fillField('#referToJudge_judgeReferEventDescription', 'Test test');
      await this.fillField('#referToJudge_judgeReferAdditionalInfo', 'Test additional Info');
      await this.click('Continue');
      await this.waitInUrl('REFER_TO_JUDGE/submit', 5);
      await this.click('Submit');
    },

    referToLA: async function() {
      await this.waitInUrl('REFER_TO_LEGAL_ADVISOR');
      await this.fillField('#referToLegalAdvisor_legalAdvisorEventDescription', 'Test test');
      await this.fillField('#referToLegalAdvisor_legalAdvisorAdditionalInfo', 'Test additional Info');
      await this.click('Continue');
      await this.waitInUrl('REFER_TO_LEGAL_ADVISOR/submit', 5);
      await this.click('Submit');
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
