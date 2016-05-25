(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/chat'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    messages: [],
    output: '',
    socketConnected: false,
    socket: null
  },
  onconstruct: function() {
    this.data.messages = ['Loading. Please wait.'];
  },
  onrender: function() {    

    var self = this;
    var socket = io('http://localhost:9000');

    var onConnect = function() {
      self.push('messages', 'Connected!');
      self.set('socketConnected', true);
      self.find('input[type="text"]').focus();
    }
    var send = function() {
      socket.emit('client-talking', { text: self.get('text')});
      self.set('text', '');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', function() {
      self.set('socketConnected', false);
      self.push('messages', 'Disconnected!');
    });
    socket.on('server-talking', function(data) {
      var message = '<span style="color:' + data.color + '">';
      message += data.user + ': ' + data.text;
      message += '</span>';
      self.push('messages', message);
    });

    this.on('send', send);
    this.observe('messages', this.updateOutput);
    
    if(socket.connected) {
      onConnect();
    }

    this.find('form').addEventListener('keypress', function(e) {
      if(e.keyCode === 13 && e.target.nodeName === 'INPUT') {
        e.preventDefault();
        send();
      }
    });

  },
  updateOutput: function() {
    this.set('output', this.get('messages').join('<br />'));
    var outputEl = this.find('[data-component="output"]');
    outputEl.scrollTop = outputEl.scrollHeight;
  }
});
},{"../../tpl/chat":19,"../views/Footer":17,"../views/Navigation":18}],2:[function(require,module,exports){
var Friends = require('../models/Friends');

module.exports = Ractive.extend({
  template: require('../../tpl/find-friends'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    loading: false,
    message: '',
    searchFor: '',
    foundFriends: null
  },
  onrender: function() {

    var model = new Friends();
    var self = this;

    this.on('find', function(e) {
      self.set('loading', true);
      self.set('message', '');
      var searchFor = this.get('friendName');
      model.find(searchFor, function(err, res) {
        self.set('loading', false);
        if(res.friends && res.friends.length > 0) {
          self.set('foundFriends', res.friends);
        } else {
          self.set('foundFriends', null);
          self.set('message', 'Sorry, there is no friends matching <strong>' + searchFor + '<strong>');
        }
      });
    });
    this.on('add', function(e, id) {
      this.set('loading', true);
      model.add(id, function(err, res) {
        self.set('loading', false);
        self.set('foundFriends', null);
        if(err) {
          self.set('message', 'Operation failed.');
        } else if(res.success === 'OK') {
          self.set('message', 'Operation successful.');
        }
      });
    });

  }
});
},{"../../tpl/find-friends":20,"../models/Friends":13,"../views/Footer":17,"../views/Navigation":18}],3:[function(require,module,exports){
var ContentModel = require('../models/Content');
var Friends = require('../models/Friends');

module.exports = Ractive.extend({
  template: require('../../tpl/home'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    posting: true,
    taggedFriends: []
  },
  onrender: function() {
    if(userModel.isLogged()) {

      var model = new ContentModel();
      var self = this;

      this.on('post', function() {
        var files = this.find('input[type="file"]').files;
        var formData = new FormData();
        if(files.length > 0) {
          var file = files[0];
          if(file.type.match('image.*')) {
            formData.append('files', file, file.name);
          }
        }
        formData.append('text', this.get('text'));
        formData.append('taggedFriends', JSON.stringify(this.get('taggedFriends')));
        model.create(formData, function(error, result) {
          if(error) {
            self.set('error', error.error);
          } else {
            self.set('text', '');
            self.set('taggedFriends', []);
            self.set('error', false);
            self.set('success', 'The post is saved successfully.<br />What about adding another one?');
            getPosts();
          }
        });
      });
      this.on('share', function(e, id) {
        var formData = new FormData();
        formData.append('postId', id);
        model.usePost('share', formData, getPosts);
      });
      this.on('like', function(e, id) {
        var formData = new FormData();
        formData.append('postId', id);
        model.usePost('like', formData, getPosts);
      });

      var getPosts = function() {
        model.fetch(function(err, result) {
          if(!err) {
            self.set('posts', result.posts);
          }
        });
      };

      getPosts();

      var friends = new Friends();
      friends.fetch(function(err, result) {
        self.set('friends', result.friends);
      });

    } else {
      this.set('posting', false);
    }
  }
});
},{"../../tpl/home":22,"../models/Content":12,"../models/Friends":13,"../views/Footer":17,"../views/Navigation":18}],4:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/login'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('email', userModel.setter('email'));
    this.observe('password', userModel.setter('password'));
    this.on('login', function() {
      userModel.login(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          window.location.href = '/';
        }
      });
    });
  }
});
},{"../../tpl/login":23,"../views/Footer":17,"../views/Navigation":18}],5:[function(require,module,exports){
var PagesModel = require('../models/Pages');
var ContentModel = require('../models/Content');

module.exports = Ractive.extend({
  template: require('../../tpl/pages'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: { },
  onrender: function() {
    var model = new PagesModel();
    var self = this;

    var pageId = this.get('pageId');
    var showEvents = this.get('showEvents');
    if(pageId) {
      var showPage = function() {
        model.getPage(pageId, function(err, result) {
          if(!err && result.pages.length > 0) {
            var page = result.pages[0];
            self.set('pageTitle', page.title);
            self.set('pageDescription', page.description);
            self.set('pageId', pageId);
            if(showEvents) {
              self.set('events', page.events);
            } else {
              self.set('comments', page.comments);
            }
          } else {
            self.set('pageTitle', 'Missing page.');
          }
        });
      }
      showPage();
      this.on('add-comment', function() {
        var contentModel = new ContentModel();
        var formData = new FormData();
        formData.append('text', this.get('text'));
        formData.append('pageId', pageId);
        contentModel.create(formData, function(error, result) {
          if(error) {
            self.set('error', error.error);
          } else {
            self.set('error', false);
            self.set('success', 'The post is saved successfully.');
            self.set('text', '');
            showPage();
          }
        });
      });
      this.on('add-event', function() {
        var contentModel = new ContentModel();
        var formData = new FormData();
        formData.append('text', this.get('text'));
        formData.append('eventDate', this.get('date'));
        formData.append('pageId', pageId);
        contentModel.create(formData, function(error, result) {
          if(error) {
            self.set('error', error.error);
          } else {
            self.set('text', '');
            self.set('error', false);
            self.set('success', 'The post is saved successfully.');
            showPage();
          }
        });
      });
      return;
    }

    this.on('create', function() {
      var formData = new FormData();
      formData.append('title', this.get('title'));
      formData.append('description', this.get('description'));
      model.create(formData, function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('title', '');
          self.set('description', '');
          self.set('error', false);
          self.set('success', 'The page was created successfully. Go <a href="">there</a> and add a comment.');        }
          getPages();
      });
    });

    var getPages = function() {
      model.fetch(function(err, result) {
        if(!err) {
          self.set('pages', result.pages);
        }
      });
    };

    getPages();
  }
});
},{"../../tpl/pages":25,"../models/Content":12,"../models/Pages":14,"../views/Footer":17,"../views/Navigation":18}],6:[function(require,module,exports){
var Friends = require('../models/Friends');

module.exports = Ractive.extend({
  template: require('../../tpl/profile'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    friends: []
  },
  onrender: function() {
    var self = this;
    this.set(userModel.get('value'));
    this.on('updateProfile', function() {
      userModel.set('value.firstName', this.get('firstName'));
      userModel.set('value.lastName', this.get('lastName'));
      if(this.get('password') != '') {
        userModel.set('value.password', this.get('password'));
      }
      userModel.save(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Profile updated successfully.');
        }
      });
    });
    this.on('deleteProfile', function() {
      if(confirm('Are you sure! Your account will be deleted permanently.')) {
        userModel.del(function() {
          window.location.href = '/';
        });
      }
    });

    var friends = new Friends();
    friends.fetch(function(err, result) {
      self.set('friends', result.friends);
    });
  }
});
},{"../../tpl/profile":26,"../models/Friends":13,"../views/Footer":17,"../views/Navigation":18}],7:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/register'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  onrender: function() {
    var self = this;
    this.observe('firstName', userModel.setter('value.firstName'));
    this.observe('lastName', userModel.setter('value.lastName'));
    this.observe('email', userModel.setter('value.email'));
    this.observe('password', userModel.setter('value.password'));
    this.on('register', function() {
      userModel.create(function(error, result) {
        if(error) {
          self.set('error', error.error);
        } else {
          self.set('error', false);
          self.set('success', 'Registration successful. Click <a href="/login">here</a> to login.');
        }
      });
    });
  }
});
},{"../../tpl/register":27,"../views/Footer":17,"../views/Navigation":18}],8:[function(require,module,exports){
var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var Register = require('./controllers/Register');
var Login = require('./controllers/Login');
var Profile = require('./controllers/Profile');
var FindFriends = require('./controllers/FindFriends');
var Pages = require('./controllers/Pages');
var Chat = require('./controllers/Chat');
var UserModel = require('./models/User');
var currentPage;
var body;

var showPage = function(newPage) {
  if(currentPage) currentPage.teardown();
  currentPage = newPage;
  body.innerHTML = '';
  currentPage.render(body);
  currentPage.on('navigation.goto', function(e, route) {
    Router.navigate(route);
  });
}

window.onload = function() {

  body = document.querySelector('body .container');
  userModel = new UserModel();
  userModel.fetch(function(error, result) {
    Router
    .add('home', function() {
      var p = new Home();
      showPage(p);
    })
    .add('register', function() {
      var p = new Register();
      showPage(p);
    })
    .add('login', function() {
      var p = new Login();
      showPage(p);
    })
    .add('find-friends', function() {
      if(userModel.isLogged()) {
        var p = new FindFriends();
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add('logout', function() {
      userModel.logout(function(error, result) {
        window.location.href = '/';
      });
    })
    .add('profile', function() {
      if(userModel.isLogged()) {
        var p = new Profile();
        showPage(p);
      } else {
        Router.navigate('login');
      }    
    })
    .add('pages/:id/:events', function(params) {
      if(userModel.isLogged()) {
        var p = new Pages({ 
          data: {
            pageId: params.id,
            showEvents: !!params.events
          }
        });
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add('pages/:id', function(params) {
      if(userModel.isLogged()) {
        var p = new Pages({ 
          data: {
            pageId: params.id
          }
        });
        showPage(p);
      } else {
        Router.navigate('login');
      }
    })
    .add('pages', function() {
      if(userModel.isLogged()) {
        var p = new Pages();
        showPage(p);
      } else {
        Router.navigate('login');
      }    
    })
    .add('chat', function() {
      if(userModel.isLogged()) {
        var p = new Chat();
        showPage(p);
      } else {
        Router.navigate('login');
      }    
    })
    .add(function() {
      Router.navigate('home');
    })
    .listen()
    .check();
  });

}
},{"./controllers/Chat":1,"./controllers/FindFriends":2,"./controllers/Home":3,"./controllers/Login":4,"./controllers/Pages":5,"./controllers/Profile":6,"./controllers/Register":7,"./lib/Router":10,"./models/User":15}],9:[function(require,module,exports){
module.exports = {
  request: function(ops) {
    if(typeof ops == 'string') ops = { url: ops };
    ops.url = ops.url || '';
    ops.method = ops.method || 'get'
    ops.data = ops.data || {};
    var getParams = function(data, url) {
      var arr = [], str;
      for(var name in data) {
        arr.push(name + '=' + encodeURIComponent(data[name]));
      }
      str = arr.join('&');
      if(str != '') {
        return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
      }
      return '';
    }
    var api = {
      host: {},
      process: function(ops) {
        var self = this;
        this.xhr = null;
        if(window.ActiveXObject) { this.xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
        else if(window.XMLHttpRequest) { this.xhr = new XMLHttpRequest(); }
        if(this.xhr) {
          this.xhr.onreadystatechange = function() {
            if(self.xhr.readyState == 4 && self.xhr.status == 200) {
              var result = self.xhr.responseText;
              if(ops.json === true && typeof JSON != 'undefined') {
                result = JSON.parse(result);
              }
              self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
            } else if(self.xhr.readyState == 4) {
              self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
            }
            self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
          }
        }
        if(ops.method == 'get') {
          this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
        } else {
          if(ops.formData) {
            this.xhr.open(ops.method, ops.url);
          } else {
            this.xhr.open(ops.method, ops.url, true);
            this.setHeaders({
              'X-Requested-With': 'XMLHttpRequest',
              'Content-type': 'application/x-www-form-urlencoded'
            });
          }
        }
        if(ops.headers && typeof ops.headers == 'object') {
          this.setHeaders(ops.headers);
        }       
        setTimeout(function() {
          if(ops.formData) {
            self.xhr.send(ops.formData); 
          } else {
            ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data)); 
          }
        }, 20);
        return this;
      },
      done: function(callback) {
        this.doneCallback = callback;
        return this;
      },
      fail: function(callback) {
        this.failCallback = callback;
        return this;
      },
      always: function(callback) {
        this.alwaysCallback = callback;
        return this;
      },
      setHeaders: function(headers) {
        for(var name in headers) {
          this.xhr && this.xhr.setRequestHeader(name, headers[name]);
        }
      }
    }
    return api.process(ops);
  }
}
},{}],10:[function(require,module,exports){
module.exports = function() {
  return {
    routes: [],
    root: '/',
    getFragment: function() {
      var fragment = '';
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
      return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
      return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(re, handler) {
      if(typeof re == 'function') {
        handler = re;
        re = '';
      }
      this.routes.push({ re: re, handler: handler});
      return this;
    },
    check: function(f, params) {
      var fragment = typeof f !== 'undefined' ? f.replace(/^\//, '') : this.getFragment(), vars;
      for(var i=0; i<this.routes.length; i++) {
        var match, re = this.routes[i].re;
        re = re.replace(/^\//, '');
        var vars = re.match(/:[^\s/]+/g);
        var r = new RegExp('^' + re.replace(/:[^\s/]+/g, '([\\w-]+)'));
        match = fragment.match(r);
        if(match) {
          match.shift();
          var matchObj = {};
          if(vars) {
            for(var j=0; j<vars.length; j++) {
              var v = vars[j];
              matchObj[v.substr(1, v.length)] = match[j];
            }
          }
          this.routes[i].handler.apply({}, (params || []).concat([matchObj]));
          return this;
        }
      }
      return false;
    },
    listen: function() {
      var self = this;
      var current = self.getFragment();
      var fn = function() {
        if(current !== self.getFragment()) {
          current = self.getFragment();
          self.check(current);
        }
      }
      clearInterval(this.interval);
      this.interval = setInterval(fn, 50);
      return this;
    },
    navigate: function(path) {
      path = path ? path : '';
      history.pushState(null, null, this.root + this.clearSlashes(path));
      return this;
    }
  }
};
},{}],11:[function(require,module,exports){
var ajax = require('../lib/Ajax');
module.exports = Ractive.extend({
  data: {
    value: null,
    url: ''
  },
  fetch: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      json: true
    })
    .done(function(result) {
      self.set('value', result);
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      self.set('value', null);
      if(cb) {
        cb({ error: 'Error loading ' + self.get('url')});
      }
    });
    return this;
  },
  create: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'POST',
      data: this.get('value'),
      json: true
    })
    .done(function(result) {
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      if(cb) {
        cb(JSON.parse(xhr.responseText));
      }
    });
    return this;
  },
  save: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'PUT',
      data: this.get('value'),
      json: true
    })
    .done(function(result) {
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      if(cb) {
        cb(JSON.parse(xhr.responseText));
      }
    });
    return this;
  },
  del: function(cb) {
    var self = this;
    ajax.request({
      url: self.get('url'),
      method: 'DELETE',
      json: true
    })
    .done(function(result) {
      if(cb) {
        cb(null, result);
      }
    })
    .fail(function(xhr) {
      if(cb) {
        cb(JSON.parse(xhr.responseText));
      }
    });
    return this;
  },
  bindComponent: function(component) {
    if(component) {
      this.observe('value', function(v) {
        for(var key in v) component.set(key, v[key]);
      }, { init: false });
    }
    return this;
  },
  setter: function(key) {
    var self = this;
    return function(v) {
      self.set(key, v);
    }
  }
});
},{"../lib/Ajax":9}],12:[function(require,module,exports){
var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/content'
  },
  create: function(formData, callback) {
    var self = this;
    ajax.request({
      url: this.get('url'),
      method: 'POST',
      formData: formData,
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  usePost: function(url, formData, callback) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/' + url,
      method: 'POST',
      formData: formData,
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  }
});
},{"../lib/Ajax":9,"./Base":11}],13:[function(require,module,exports){
var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/friends'
  },
  find: function(searchFor, callback) {
    ajax.request({
      url: this.get('url') + '/find',
      method: 'POST',
      data: {
        searchFor: searchFor
      },
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  add: function(id, callback) {
    ajax.request({
      url: this.get('url') + '/add',
      method: 'POST',
      data: {
        id: id
      },
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  }
});
},{"../lib/Ajax":9,"./Base":11}],14:[function(require,module,exports){
var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/pages'
  },
  create: function(formData, callback) {
    var self = this;
    ajax.request({
      url: this.get('url'),
      method: 'POST',
      formData: formData,
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  getPage: function(pageId, callback) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/' + pageId,
      method: 'GET',
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  }
});
},{"../lib/Ajax":9,"./Base":11}],15:[function(require,module,exports){
var ajax = require('../lib/Ajax');
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/user'
  },
  login: function(callback) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/login',
      method: 'POST',
      data: {
        email: this.get('email'),
        password: this.get('password')
      },
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  logout: function(callback) {
    var self = this;
    ajax.request({
      url: this.get('url') + '/logout',
      json: true
    })
    .done(function(result) {
      callback(null, result);
    })
    .fail(function(xhr) {
      callback(JSON.parse(xhr.responseText));
    });
  },
  isLogged: function() {
    return this.get('value.firstName') && this.get('value.lastName');
  }
});
},{"../lib/Ajax":9,"./Base":11}],16:[function(require,module,exports){
var Base = require('./Base');
module.exports = Base.extend({
  data: {
    url: '/api/version'
  }
});
},{"./Base":11}],17:[function(require,module,exports){
var FooterModel = require('../models/Version');

module.exports = Ractive.extend({
  template: require('../../tpl/footer'),
  onrender: function() {
    var model = new FooterModel();
    model.bindComponent(this).fetch();
  }
});
},{"../../tpl/footer":21,"../models/Version":16}],18:[function(require,module,exports){
module.exports = Ractive.extend({
  template: require('../../tpl/navigation'),
  onconstruct: function() {
    this.data.isLogged = !!userModel.isLogged();
  }
});
},{"../../tpl/navigation":24}],19:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Chat"]}]}," ",{"t":7,"e":"form","f":[{"t":7,"e":"div","a":{"class":"chat-output","data-component":"output"},"f":[{"t":3,"r":"output"}]}," ",{"t":4,"n":50,"r":"socketConnected","f":[{"t":7,"e":"input","a":{"type":"text","value":[{"t":2,"r":"text"}]}}," ",{"t":7,"e":"a","a":{"href":"#","class":"button"},"v":{"click":"send"},"f":["Send"]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],20:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Find friends"]}]}," ",{"t":7,"e":"form","a":{"onsubmit":"return false;"},"f":[{"t":4,"n":50,"r":"loading","f":[{"t":7,"e":"p","f":["Loading. Please wait."]}]},{"t":4,"n":51,"f":[{"t":7,"e":"label","a":{"for":"friend-name"},"f":["Please, type the name of your friend:"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"friend-name","value":[{"t":2,"r":"friendName"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"Find"},"v":{"click":"find"}}],"r":"loading"}]}," ",{"t":4,"n":50,"x":{"r":["foundFriends"],"s":"_0!==null"},"f":[{"t":7,"e":"div","a":{"class":"friends-list"},"f":[{"t":4,"n":52,"r":"foundFriends","f":[{"t":7,"e":"div","a":{"class":"friend-list-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"r":"firstName"}," ",{"t":2,"r":"lastName"}]}," ",{"t":7,"e":"input","a":{"type":"button","value":"Add as a friend"},"v":{"click":{"n":"add","d":[{"t":2,"r":"id"}]}}}]}]}]}]},{"t":4,"n":50,"x":{"r":["message"],"s":"_0!==\"\""},"f":[{"t":7,"e":"div","a":{"class":"friends-list"},"f":[{"t":7,"e":"p","f":[{"t":3,"r":"message"}]}]}]},{"t":7,"e":"appfooter"}]}
},{}],21:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"footer","f":["Version: ",{"t":2,"r":"version"}]}]}
},{}],22:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":4,"n":50,"x":{"r":["posting"],"s":"_0===true"},"f":[{"t":7,"e":"form","a":{"enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"h3","f":["What is on your mind?"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","f":["Text"]}," ",{"t":7,"e":"textarea","a":{"value":[{"t":2,"r":"text"}]}}," ",{"t":7,"e":"p","f":["Tag friends: ",{"t":4,"n":52,"r":"friends","i":"index","f":[{"t":7,"e":"label","f":[{"t":7,"e":"input","a":{"type":"checkbox","name":[{"t":2,"r":"taggedFriends"}],"value":[{"t":2,"rx":{"r":"friends","m":[{"t":30,"n":"index"},"id"]}}]}}," ",{"t":2,"rx":{"r":"friends","m":[{"t":30,"n":"index"},"firstName"]}}," ",{"t":2,"rx":{"r":"friends","m":[{"t":30,"n":"index"},"lastName"]}}]}]}]}," ",{"t":7,"e":"input","a":{"type":"file","name":"file"}}," ",{"t":7,"e":"input","a":{"type":"button","value":"Post"},"v":{"click":"post"}}]}," ",{"t":4,"n":52,"r":"posts","i":"index","f":[{"t":7,"e":"div","a":{"class":"content-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"userName"]}}]}," ",{"t":7,"e":"p","f":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"text"]}}]}," ",{"t":4,"n":50,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"via"]},"f":[{"t":7,"e":"small","f":["via ",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"via"]}}]}]}," ",{"t":4,"n":50,"x":{"r":["index","posts"],"s":"_1[_0].taggedFriends.length>0"},"f":[{"t":7,"e":"p","f":[{"t":7,"e":"small","f":["Tagged: ",{"t":2,"x":{"r":["index","posts"],"s":"_1[_0].taggedFriends.join(\", \")"}}]}]}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"input","a":{"type":"button","value":["Like (",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"numberOfLikes"]}},")"]},"v":{"click":{"n":"like","d":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"id"]}}]}}}," ",{"t":4,"n":50,"x":{"r":["index","posts"],"s":"!_1[_0].ownPost"},"f":[{"t":7,"e":"input","a":{"type":"button","value":"Share"},"v":{"click":{"n":"share","d":[{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"id"]}}]}}}]}]}," ",{"t":4,"n":50,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"file"]},"f":[{"t":7,"e":"br"},{"t":7,"e":"br"}," ",{"t":7,"e":"img","a":{"src":["/static/uploads/",{"t":2,"rx":{"r":"posts","m":[{"t":30,"n":"index"},"file"]}}]}}]}]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"h1","f":["Node.js by example"]}],"x":{"r":["posting"],"s":"_0===true"}}]}," ",{"t":7,"e":"appfooter"}]}
},{}],23:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Login"]}]}," ",{"t":7,"e":"form","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"label","a":{"for":"email"},"f":["Email"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"password"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"login"},"v":{"click":"login"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}," ",{"t":7,"e":"appfooter"}]}
},{}],24:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"nav","f":[{"t":7,"e":"ul","f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"home"}},"f":["Home"]}]}," ",{"t":4,"n":50,"x":{"r":["isLogged"],"s":"!_0"},"f":[{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"register"}},"f":["Register"]}]}," ",{"t":7,"e":"li","f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"login"}},"f":["Login"]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"logout"}},"f":["Logout"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"profile"}},"f":["Profile"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"find-friends"}},"f":["Find friends"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"pages"}},"f":["Pages"]}]}," ",{"t":7,"e":"li","a":{"class":"right"},"f":[{"t":7,"e":"a","v":{"click":{"n":"goto","a":"chat"}},"f":["Chat"]}]}],"x":{"r":["isLogged"],"s":"!_0"}}]}]}]}
},{}],25:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":4,"n":50,"r":"pageId","f":[{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":[{"t":2,"r":"pageTitle"}]}," ",{"t":7,"e":"p","f":[{"t":2,"r":"pageDescription"}]}]}," ",{"t":4,"n":50,"r":"showEvents","f":[{"t":7,"e":"form","a":{"enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"a","a":{"href":["/pages/",{"t":2,"r":"pageId"}],"class":"button m-right right"},"f":["View comments"]}," ",{"t":7,"e":"h3","f":["Add new event"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","a":{"for":"text"},"f":["Title"]}," ",{"t":7,"e":"textarea","a":{"value":[{"t":2,"r":"text"}]}}," ",{"t":7,"e":"label","a":{"for":"date"},"f":["Date"]}," ",{"t":7,"e":"input","a":{"type":"date","value":[{"t":2,"r":"date"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"Create"},"v":{"click":"add-event"}}]}," ",{"t":4,"n":52,"r":"events","i":"index","f":[{"t":7,"e":"div","a":{"class":"content-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"rx":{"r":"events","m":[{"t":30,"n":"index"},"eventDate"]}}," / ",{"t":2,"rx":{"r":"events","m":[{"t":30,"n":"index"},"text"]}}]}," ",{"t":7,"e":"p","f":["Created by ",{"t":2,"rx":{"r":"events","m":[{"t":30,"n":"index"},"userName"]}}]}]}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"form","a":{"enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"a","a":{"href":["/pages/",{"t":2,"r":"pageId"},"/events"],"class":"button right"},"f":["View events"]}," ",{"t":7,"e":"h3","f":["Add a comment for this page"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","a":{"for":"text"},"f":["Text"]}," ",{"t":7,"e":"textarea","a":{"value":[{"t":2,"r":"text"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"Post"},"v":{"click":"add-comment"}}]}," ",{"t":4,"n":52,"r":"comments","i":"index","f":[{"t":7,"e":"div","a":{"class":"content-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"rx":{"r":"comments","m":[{"t":30,"n":"index"},"userName"]}}]}," ",{"t":7,"e":"p","f":[{"t":2,"rx":{"r":"comments","m":[{"t":30,"n":"index"},"text"]}}]}]}]}],"r":"showEvents"}]},{"t":4,"n":51,"f":[{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"form","a":{"enctype":"multipart/form-data","method":"post"},"f":[{"t":7,"e":"h3","f":["Add a new page"]}," ",{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","a":{"for":"text"},"f":["Title"]}," ",{"t":7,"e":"textarea","a":{"value":[{"t":2,"r":"title"}]}}," ",{"t":7,"e":"label","a":{"for":"text"},"f":["Description"]}," ",{"t":7,"e":"textarea","a":{"value":[{"t":2,"r":"description"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"Create"},"v":{"click":"create"}}]}]}," ",{"t":4,"n":52,"r":"pages","i":"index","f":[{"t":7,"e":"div","a":{"class":"content-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"rx":{"r":"pages","m":[{"t":30,"n":"index"},"title"]}}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"small","f":["Created by ",{"t":2,"rx":{"r":"pages","m":[{"t":30,"n":"index"},"userName"]}}]}]}," ",{"t":7,"e":"p","f":[{"t":2,"rx":{"r":"pages","m":[{"t":30,"n":"index"},"description"]}}]}," ",{"t":7,"e":"p","f":[{"t":7,"e":"a","a":{"href":["/pages/",{"t":2,"rx":{"r":"pages","m":[{"t":30,"n":"index"},"id"]}}],"class":"button"},"f":["Visit the page"]}]}]}]}],"r":"pageId"},{"t":7,"e":"appfooter"}]}
},{}],26:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Profile"]}]}," ",{"t":7,"e":"form","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":3,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]}," ",{"t":7,"e":"label","a":{"for":"first-name"},"f":["First name"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"first-name","value":[{"t":2,"r":"firstName"}]}}," ",{"t":7,"e":"label","a":{"for":"last-name"},"f":["Last name"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"last-name","value":[{"t":2,"r":"lastName"}]}}," ",{"t":7,"e":"label","a":{"for":"password"},"f":["Change password"]}," ",{"t":7,"e":"input","a":{"type":"password","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"update"},"v":{"click":"updateProfile"}}," ",{"t":7,"e":"input","a":{"type":"button","value":"delete account","class":"right attention"},"v":{"click":"deleteProfile"}}]}," ",{"t":4,"n":50,"x":{"r":["friends.length"],"s":"_0>0"},"f":[{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Friends"]}]}," ",{"t":7,"e":"div","a":{"class":"friends-list"},"f":[{"t":4,"n":52,"r":"friends","i":"index","f":[{"t":7,"e":"div","a":{"class":"friend-list-item"},"f":[{"t":7,"e":"h2","f":[{"t":2,"rx":{"r":"friends","m":[{"t":30,"n":"index"},"firstName"]}}," ",{"t":2,"rx":{"r":"friends","m":[{"t":30,"n":"index"},"lastName"]}}]}]}]}]}]},{"t":7,"e":"appfooter"}]}
},{}],27:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}]}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Register"]}]}," ",{"t":7,"e":"form","f":[{"t":4,"n":50,"x":{"r":["error"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"error"},"f":[{"t":2,"r":"error"}]}]}," ",{"t":4,"n":50,"x":{"r":["success"],"s":"_0&&_0!=\"\""},"f":[{"t":7,"e":"div","a":{"class":"success"},"f":[{"t":3,"r":"success"}]}]},{"t":4,"n":51,"f":[{"t":7,"e":"label","a":{"for":"first-name"},"f":["First name"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"first-name","value":[{"t":2,"r":"firstName"}]}}," ",{"t":7,"e":"label","a":{"for":"last-name"},"f":["Last name"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"last-name","value":[{"t":2,"r":"lastName"}]}}," ",{"t":7,"e":"label","a":{"for":"email"},"f":["Email"]}," ",{"t":7,"e":"input","a":{"type":"text","id":"email","value":[{"t":2,"r":"email"}]}}," ",{"t":7,"e":"label","a":{"for":"password"},"f":["Password"]}," ",{"t":7,"e":"input","a":{"type":"password","id":"password","value":[{"t":2,"r":"password"}]}}," ",{"t":7,"e":"input","a":{"type":"button","value":"register"},"v":{"click":"register"}}],"x":{"r":["success"],"s":"_0&&_0!=\"\""}}]}," ",{"t":7,"e":"appfooter"}]}
},{}]},{},[8])