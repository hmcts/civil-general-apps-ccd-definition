const { expect, assert} = require('chai');
const { uniqWith } = require('lodash');
const { isFieldDuplicated } = require('../utils/utils');
const { createAssertExists } = require('../utils/assertBuilders');
const dataProvider = require('../utils/dataProvider');

const assertFieldExists = createAssertExists('Field');

dataProvider.exclusions.forEach((value, key) =>  {
  describe('AuthorisationCaseFieldGAspec'.concat(': ', key, ' config'), () => {
    context('should :', () => {
      let authorisationCaseFieldGAspecConfig = [];
      let caseFieldConfig = [];
      let errors = [];

      before(() => {
        authorisationCaseFieldGAspecConfig = dataProvider.getConfig('../../../../ga-ccd-definition/AuthorisationCaseFieldGAspec', key);
        caseFieldConfig = dataProvider.getConfig('../../../../ga-ccd-definition/CaseField', key);
      });

      it('contain a unique case field ID, case type ID and role (no duplicates)', () => {
        const uniqResult = uniqWith(authorisationCaseFieldGAspecConfig, isFieldDuplicated('CaseFieldID'));
        try {
          expect(uniqResult).to.eql(authorisationCaseFieldGAspecConfig);
        } catch (error) {
          authorisationCaseFieldGAspecConfig.forEach(c => {
            if (!uniqResult.includes(c)) {
              errors.push(c.CaseFieldID);
            }
          });
        }
        if (errors.length) {
          assert.fail(`Found duplicated AuthorisationCaseFieldGAspec - ${errors}`);
        }
      });

      it('use existing fields', () => {
        assertFieldExists(authorisationCaseFieldGAspecConfig, caseFieldConfig);
      });
    });
  });
});
