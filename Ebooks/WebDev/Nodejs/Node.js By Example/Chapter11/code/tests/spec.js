describe("Testing", function () {

  var trigger = function(element, event, eventGroup, keyCode) {
    var e = window.document.createEvent(eventGroup || 'MouseEvents');
    if(keyCode) {
      e.keyCode = e.which = keyCode;
    }
    e.initEvent(event, true, true);
    return element.dispatchEvent(e);
  }

  it("Registration", function (done) {

    var firstName = document.querySelector('#first-name');
    firstName.value = 'First name';
    trigger(firstName, 'change');

    var lastName = document.querySelector('#last-name');
    lastName.value = 'Last name';
    trigger(lastName, 'change');

    var email = document.querySelector('#email');
    email.value = 'wrong email';
    trigger(email, 'change');

    var password = document.querySelector('#password');
    password.value = 'password';
    trigger(password, 'change');

    var submitted = 0;
    window.currentPage.on('form-submited', function() {
      if(submitted === 0) {
        submitted++;
        var error = document.querySelector('.error');
        expect(!!error).to.be.equal(true);
        var email = document.querySelector('#email');
        var validEmail = 'test' + (new Date()).getTime() + '@test.com';
        email.value = validEmail;
        trigger(email, 'change');
        trigger(document.querySelector('input[value="register"]'), 'click');
      } else {    
        var success = document.querySelector('.success');
        expect(!!success).to.be.equal(true);
        done();
      }
    });

    trigger(document.querySelector('input[value="register"]'), 'click');

  });

});