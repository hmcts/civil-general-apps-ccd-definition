const { expect, assert} = require('chai');
const { uniqWith } = require('lodash');
const {
  MEDIUM_STRING,
  isNotEmpty,
  isNotLongerThan,
  noDuplicateFound
} = require('../utils/utils');
const dataProvider = require('../utils/dataProvider');

function assertFieldDefinitionIsValid(row) {
  expect(row.CaseTypeID).to.be.a('string').and.satisfy(v => {
    return v.startsWith('GENERALAPPLICATION');
  });
  expect(row.ID).to.be.a('string').and.satisfy(isNotLongerThan(MEDIUM_STRING));
  expect(row.Label).to.be.a('string').and.satisfy(isNotEmpty());
  // todo: had to toLowercase this because of inconsistency
  expect((row.SecurityClassification).toLowerCase()).to.eq('public');
  expect(row.FieldType).to.be.a('string').and.satisfy(isNotLongerThan(MEDIUM_STRING));
  if (row.FieldType === 'Collection' || row.FieldType === 'FixedList' ||
    row.FieldType === 'FixedRadioList' || row.FieldType === 'MultiSelectList') {
    expect(row.FieldTypeParameter).to.be.a('string').and.satisfy(isNotEmpty());
  }
}

dataProvider.exclusions.forEach((value, key) =>  {
  describe('CaseFieldGAspec'.concat(': ', key, ' config'), () => {
    context('should :', () => {
      let uniqResult = [];
      let caseFieldGAspecConfig = [];
      let errors = [];
      before(() => {
        caseFieldGAspecConfig = dataProvider.getConfig('../../../../ga-ccd-definition/CaseFieldGAspec', key);
        uniqResult = uniqWith(caseFieldGAspecConfig, noDuplicateFound);
      });

      it('not contain duplicated definitions of the same field', () => {
        try {
          expect(uniqResult).to.eql(caseFieldGAspecConfig);
        } catch (error) {
          caseFieldGAspecConfig.forEach(c => {
            if (!uniqResult.includes(c)) {
              errors.push(c.ID);
            }
          });
        }
        if (errors.length) {
          assert.fail(`Found duplicated CaseFieldGAspec IDs - ${errors}`);
        }
      });

      it('should have only valid definitions', () => {
        uniqResult.forEach(assertFieldDefinitionIsValid);
      });
    });
  });
});
