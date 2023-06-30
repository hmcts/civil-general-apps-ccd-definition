const I = actor();

module.exports = {

  fields: {
    username: '#username',
    password: '#password',
    submitButton: 'input[value="Sign in"]',
  },

  signIn(user) {
    I.waitForSelector(this.fields.username, 10);
    I.fillField(this.fields.username, user.email);
    I.fillField(this.fields.password, user.password);
    I.retry(5).waitForElement(this.fields.submitButton);
    I.click(this.fields.submitButton);
  },
};
