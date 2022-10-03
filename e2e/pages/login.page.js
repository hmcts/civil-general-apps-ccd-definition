const {I} = inject();

module.exports = {

  fields: {
    username: '#username',
    password: '#password',
  },
  submitButton: 'input[value="Sign in"]',

  async signIn(user) {
    await I.waitForElement(this.fields.username, 10);
    await I.fillField(this.fields.username, user.email);
    I.fillField(this.fields.password, user.password);
    I.waitForElement(this.submitButton, 10);
    await I.click(this.submitButton);
  },
};
