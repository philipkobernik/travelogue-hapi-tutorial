var Hapi = require('hapi');
var LocalStrategy = require('passport-local').Strategy;
var Joi = require('joi');

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

var Passport = server.plugins.travelogue.passport;
Passport.use(new LocalStrategy(function (username, password, done){
  if (USERS.hasOwnProperty(username) && USERS[username] == password) {
    return done(null, { username: username });
  }
  return done(null, false, {'message': 'invalid credentials'});
}));

Passport.serializeUser(function (user, done) {
  done(null, user);
});

Passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

if (process.env.DEBUG) {
  server.on('internalError', function(event) {
    console.log(event);
  });
}

require('./config/routes')(server, passport);


server.start(function() {
  console.log('server started on port: ', server.info.port);
});


