// load modules
// ============
var Hapi = require('hapi');
var LocalStrategy = require('passport-local').Strategy;
var Joi = require('joi');
var mongoose = require('mongoose');

// setup database
// ==============
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// configure server
// ================
var config = {
  hostname: 'localhost',
  port: 8000,
  urls: {
    failureRedirect: '/login'
  },
  excludePaths: ['/public/']
};

var plugins = {
  yar: {
    cookieOptions: {
      password: 'sweetCookieJar',
      isSecure: false
    }
  },
  travelogue: config
};

var server = new Hapi.Server(config.hostname, config.port, {
  views: {
    engines: {
      jade: "jade"
    },
    path: "./views"
  }
});

server.pack.require(plugins, function(err) {
  if (err) {
    throw err;
  }
});

// configure passport
// ==================
server.auth.strategy('passport', 'passport');
var passport = server.plugins.travelogue.passport;
require('./config/passport')(passport); // bulk of config happens here

if (process.env.DEBUG) {
  server.on('internalError', function(event) {
    console.log(event);
  });
}

// configure routes
// ================
require('./config/routes')(server, passport);

// start server
// ============
server.start(function() {
  console.log('magic is happening on at localhost:', server.info.port);
});


