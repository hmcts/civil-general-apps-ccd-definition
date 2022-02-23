const {I} = inject();

module.exports = {

  async verifyApplicationDetails(applicationTypes) {
    I.waitInUrl('#Applications', 3);
    I.see('Application type');
    I.see('Application ID');
    I.see('Status');
    I.see('Submitted on');
    applicationTypes.forEach(type => {
      return I.see(type);
    });
  }
};
