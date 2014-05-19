var Hapi = require('hapi');
var LocalStrategy = require('passport-local').Strategy;
var Joi = require('joi');
var mongoose = require('mongoose');

// setup database
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

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
      password: 'worldofwalmart',
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

server.auth.strategy('passport', 'passport');

var USERS = {
  'van': 'walmart'
};

var passport = server.plugins.travelogue.passport;

require('./config/passport')(passport); // pass passport for configuration

//passport.use(new LocalStrategy(function (username, password, done){
  //if (USERS.hasOwnProperty(username) && USERS[username] == password) {
    //return done(null, { username: username });
  //}
  //return done(null, false, {'message': 'invalid credentials'});
//}));

//passport.serializeUser(function (user, done) {
  //done(null, user);
//});

//passport.deserializeUser(function (obj, done) {
  //done(null, obj);
//});

if (process.env.DEBUG) {
  server.on('internalError', function(event) {
    console.log(event);
  });
}

require('./config/routes')(server, passport);

server.start(function() {
  console.log('server started on port: ', server.info.port);
});


