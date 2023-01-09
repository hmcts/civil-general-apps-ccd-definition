const { expect, assert} = require('chai');
const { uniqWith } = require('lodash');
const { isFieldDuplicated } = require('../utils/utils');
const { createAssertExists } = require('../utils/assertBuilders');
const dataProvider = require('../utils/dataProvider');

const assertStateExists = createAssertExists('State');

dataProvider.exclusions.forEach((value, key) =>  {
  describe('AuthorisationCaseStateGAspec'.concat(': ', key, ' config'), () => {
    context('definitions:', () => {
      let authorisationCaseStateGAspec = [];
      let stateConfig = [];
      let errors = [];

      before(() => {
        authorisationCaseStateGAspec = dataProvider.getConfig('../../../../ga-ccd-definition/AuthorisationCaseStateGAspec', key);
        stateConfig = dataProvider.ccdData.State;
      });

      it('should contain a unique case state, case type ID and role (no duplicates) for nonprod files', () => {
        const uniqResult = uniqWith(authorisationCaseStateGAspec, isFieldDuplicated('CaseStateID'));
        try {
          expect(uniqResult).to.eql(authorisationCaseStateGAspec);
        } catch (error) {
          authorisationCaseStateGAspec.forEach(c => {
            if (!uniqResult.includes(c)) {
              errors.push(c.CaseStateID);
            }
          });
        }
        if (errors.length) {
          assert.fail(`Found duplicated AuthorisationCaseStateGAspec - ${errors}`);
        }
      });

      it('should use existing states', () => {
        assertStateExists(authorisationCaseStateGAspec, stateConfig);
      });

      context('Solicitor has valid permissions', () => {
        it('CRU permissions for all states', () => {
          authorisationCaseStateGAspec.forEach(authState => {
            if (authState.UserRole === 'caseworker-civil-solicitor') {
              try {
                expect(('CRUD').includes(authState.CRUD)).to.eql(true);
              } catch (error) {
                expect.fail(null, null, `State: ${authState.CaseStateID} must have CRU permission for caseworker-civil-solicitor`);
              }
            }
          });
        });
      });
      context('caseworker-civil-systemupdate has valid permissions', () => {
        it('CRU permissions for all states', () => {
          authorisationCaseStateGAspec.forEach(authState => {
            if (authState.UserRole === 'caseworker-civil-systemupdate') {
              try {
                expect(('CRUD').includes(authState.CRUD)).to.eql(true);
              } catch (error) {
                expect.fail(null, null, `State: ${authState.CaseStateID} must have CRU permission for caseworker-civil-systemupdate`);
              }
            }
          });
        });
      });
    });
  });
});
