module.exports = function(server, passport) {

  // routes
  server.route({
    method: 'GET',
    path: '/',
    config: { auth: 'passport' },
    handler: function (request, reply) {
      // if already logged in, redirect to /home, else to /login
      reply().redirect('/home');
    }
  });

  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: false, // use this if your app uses other hapi auth schemes, otherwise optional
      handler: function(request, reply) {
        if (request.session._isAuthenticated()) {
          reply().redirect('/home');
        } else {
          reply.view('login');
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/home',
    config: { auth: 'passport' },
    handler: function (request, reply) {
      //reply("ACCESS GRANTED<br/><br/><a href='/logout'>Logout</a>");
      reply.view('home');
    }
  });

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      //validate: {
      //payload: {
      //username: Joi.string(),
      //password: Joi.string()
      //}
      //},
      auth: false,
      handler: function(request, reply) {
        passport.authenticate('local-login', {
          successRedirect: config.urls.successRedirect,
          failureRedirect: config.urls.failureRedirect,
          failureFlash: true
        })(request, reply)
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/clear',
    config: {
      auth: false,
      handler: function (request, reply) {
        request.session.reset();
        reply().redirect('/session');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/session',
    config: {
      auth: false,
      handler: function (request, reply) {
        reply("<pre>" + JSON.stringify(request.session, null, 2) + "</pre><br/><br/><a href='/login'>Login</a>");
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      auth: false,
      handler: function (request, reply) {
        request.session._logout();
        reply().redirect('/');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/public/{path}',
    handler: {
      directory: {
        path: './public'
      }
    }
  });
};
