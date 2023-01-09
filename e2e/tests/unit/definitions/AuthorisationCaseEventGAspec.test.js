const { expect, assert} = require('chai');
const { uniqWith } = require('lodash');
const {
  MEDIUM_STRING,
  isNotLongerThan,
  noDuplicateFoundEvent
} = require('../utils/utils');
const dataProvider = require('../utils/dataProvider');

function assertFieldDefinitionIsValid(row) {
  expect(row.CaseTypeID).to.be.a('string').and.satisfy(v => {
    return v.startsWith('GENERALAPPLICATION');
  });
  expect(row.CaseEventID).to.be.a('string').and.satisfy(isNotLongerThan(MEDIUM_STRING));
  expect(row.AccessControl).to.not.be.null;
}

dataProvider.exclusions.forEach((value, key) =>  {
  describe('AuthorisationCaseEventGAspec'.concat(': ', key, ' config'), () => {
    context('should :', () => {
      let authorisationCaseEventGAspecConfig = [];
      let uniqResult = [];
      let errors = [];

      before(() => {
        authorisationCaseEventGAspecConfig = dataProvider.getConfig('../../../../ga-ccd-definition/AuthorisationCaseEventGAspec', key);
        uniqResult = uniqWith(authorisationCaseEventGAspecConfig, noDuplicateFoundEvent);
      });

      it('not contain duplicated definitions of the same field', () => {
        try {
          expect(uniqResult).to.eql(authorisationCaseEventGAspecConfig);
        } catch (error) {
          authorisationCaseEventGAspecConfig.forEach(c => {
            if (!uniqResult.includes(c)) {
              errors.push(c.CaseEventID);
            }
          });
        }
        if (errors.length) {
          assert.fail(`Found duplicated AuthorisationCaseEventGAspec - ${errors}`);
        }
      });

      it('should have only valid definitions', () => {
        uniqResult.forEach(assertFieldDefinitionIsValid);
      });
    });
  });
});


