var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var currentPage;
var body;

var showPage = function(newPage) {
  if(currentPage) currentPage.teardown();
  currentPage = newPage;
  body.innerHTML = '';
  currentPage.render(body);
}

window.onload = function() {

  body = document.querySelector('body');

  Router
  .add('home', function() {
    var p = new Home();
    showPage(p);
  })
  .add(function() {
    Router.navigate('home');
  })
  .listen()
  .check();

}