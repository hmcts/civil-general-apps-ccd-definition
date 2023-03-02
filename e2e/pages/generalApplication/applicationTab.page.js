const {I} = inject();

module.exports = {

  async verifyApplicationDetails(applicationTypes, appCount) {
    await I.wait(5);
    await I.waitInUrl('#Applications', 5);
    await I.waitForElement('table.Applications', 5);
    await I.seeNumberOfElements('.collection-field-table .complex-panel-title', appCount);
    I.see('Application type');
    I.see('Application ID');
    I.see('Status');
    I.see('Submitted on');
    applicationTypes.forEach(type => {
      return I.see(type);
    });
  },
};
