const {I} = inject();

module.exports = {
  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    I.seeInCurrentUrl('Documents');
    I.see(uploadedDoc);
    I.see(expectedLabel);
    I.seeNumberOfVisibleElements('.Application.Documents a', 2);
  }
};
