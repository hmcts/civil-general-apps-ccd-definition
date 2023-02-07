const {I} = inject();

module.exports = {

  fields: {
    applicationType: {
      id: '#generalAppType_types',
      options: {
        strikeOut: 'Strike out',
        summaryJudgement: 'Summary judgement',
        stayTheClaim: 'Stay the claim',
        extendTime: 'Extend time',
        amendTheStatementOfCase: 'Amend a statement of case',
        reliefFromSanctions: 'Relief from sanctions',
      }
    },
    eventDropdown: '#next-step',
  },

  async selectApplicationType(applicationType) {
    I.waitForElement(this.fields.applicationType.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGATypePage');
    applicationType.forEach(type => {
      return I.click(type);
    });
    await I.clickContinue();
  },

  async verifyAllApplicationTypes(applicationTypes, caseNumber) {
    I.waitForElement(this.fields.applicationType.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGATypePage');
    I.see('What type of applications do you want to make?');
    I.see(caseNumber);
    applicationTypes.forEach(type => {
      return I.see(type);
    });
  },

  async chooseAppType(applicationType) {
    I.waitForElement(this.fields.applicationType.id);
    I.seeInCurrentUrl('INITIATE_GENERAL_APPLICATIONGATypePage');
    applicationType.forEach(type => {
      return I.click(type);
    });
    await I.click('Continue');
    await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 20);
    await I.see('It is not possible to select an additional application type when applying to vary judgment');
    await I.click('Cancel');
    await I.waitForElement(this.fields.eventDropdown, 5);
  }
};
