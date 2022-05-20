const {I} = inject();

module.exports = {

  fields: {
    docLabel: 'div.case-viewer-label',
    links: '.collection-field-table ccd-read-document-field a'

  },

  async verifyUploadedFile(expectedLabel, uploadedDoc) {
    I.seeInCurrentUrl('Documents');
    I.see(uploadedDoc);
    I.see(expectedLabel);
    I.seeNumberOfVisibleElements(this.fields.links , 2);
  },
};
