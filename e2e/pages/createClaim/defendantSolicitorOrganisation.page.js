const { I } = inject();

module.exports = {

  fields: respondentNumber => {
    return {
      respondentOrgRepresented: {
        id: `#respondent${respondentNumber}OrgRegistered`,
        options: {
          yes: `#respondent${respondentNumber}OrgRegistered_Yes`,
          no: `#respondent${respondentNumber}OrgRegistered_No`
        }
      },
      orgPolicyReference: `#respondent${respondentNumber}OrganisationPolicy_OrgPolicyReference`,
      searchText: '#search-org-text',
    };
  },

  async enterOrganisationDetails (respondentNumber = '1') {
    I.waitForElement(this.fields(respondentNumber).respondentOrgRepresented.id);
    await I.runAccessibilityTest();
    await within(this.fields(respondentNumber).respondentOrgRepresented.id, () => {
      I.click(this.fields(respondentNumber).respondentOrgRepresented.options.yes);
    });
    I.waitForElement(this.fields(respondentNumber).orgPolicyReference);
    I.fillField(this.fields(respondentNumber).orgPolicyReference, 'Defendant policy reference');
    I.waitForElement(this.fields(respondentNumber).searchText);
    I.fillField(this.fields(respondentNumber).searchText, 'Civil');
    I.click(`a[title="Select the organisation Civil - Organisation ${respondentNumber}"]`);
    await I.clickContinue();
  }
};

