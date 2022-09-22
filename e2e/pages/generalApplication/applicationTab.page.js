const {I} = inject();

module.exports = {

  async verifyApplicationDetails(applicationTypes, appCount) {
    I.waitInUrl('#Applications', 1);
    await I.wait(5);
    I.seeNumberOfElements('.collection-field-table .complex-panel-title', appCount);
    I.see('Application type');
    I.see('Application ID');
    I.see('Status');
    I.see('Submitted on');
    applicationTypes.forEach(type => {
      return I.see(type);
    });
  },
};
