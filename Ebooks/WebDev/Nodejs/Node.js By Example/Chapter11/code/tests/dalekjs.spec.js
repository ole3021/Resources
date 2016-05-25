// npm install dalek-cli -g
module.exports = {
  'Testing registration': function (test) {
    test
    .open('http://localhost:9000/register')
    .setValue('#first-name', 'First name')
    .setValue('#last-name', 'Last name')
    .setValue('#email', 'wrong email')
    .setValue('#password', 'password')
    .click('input[value="register"]')
    .waitForElement('.error')
    .assert.text('.error').to.contain('Invalid or missing email')
    .setValue('#email', 'test' + (new Date()).getTime() + '@test.com')
    .click('input[value="register"]')
    .waitForElement('.success')
    .assert.text('.success').to.contain('Registration successful')
    .done();
  }
};