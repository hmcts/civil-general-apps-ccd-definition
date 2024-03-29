const {I} = inject();

module.exports = {

  fields: {
    addRespondent2: {
      id: '#addRespondent2',
      options: {
        yes: '#addRespondent2_Yes',
        no: '#addRespondent2_No'
      }
    },
  },

  async enterAddAnotherDefendant() {
    I.waitForElement(this.fields.addRespondent2.id);
    await I.runAccessibilityTest();
    await within(this.fields.addRespondent2.id, () => {
      I.click(this.fields.addRespondent2.options.yes);
    });

    await I.clickContinue();
  }
};

