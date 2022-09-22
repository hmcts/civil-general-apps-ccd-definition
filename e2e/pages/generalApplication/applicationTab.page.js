const {I} = inject();

module.exports = {

  async verifyApplicationDetails(applicationTypes, appCount) {
    await I.waitInUrl('#Applications', 5);
    await I.waitForInvisible(locate('div.spinner-container').withText('Loading'), 15);
    await I.waitForVisible('.collection-field-table a', 5);
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
