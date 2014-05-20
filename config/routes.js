module.exports = function(server, passport) {

  server.route({
    method: 'GET',
    path: '/signup',
    handler: function(request, reply) {
      // render the page and pass in any flash data if it exists
      reply.view('signup', { message: request.session.flash('signupMessage') });
    }
  });

  // process the signup form
  server.route({
    method: 'POST',
    path: '/signup',
    handler: function(request, reply) {
      passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash    : true
      })(request, reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: false,
      handler: function (request, reply) {
        if (request.session._isAuthenticated()) {
          reply().redirect('/profile');
        } else {
          reply.view('index');
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: false, // use this if your app uses other hapi auth schemes, otherwise optional
      handler: function(request, reply) {
        if (request.session._isAuthenticated()) {
          reply().redirect('/profile');
        } else {
          reply.view('login', { message: request.session.flash('loginMessage') });
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/profile',
    config: { auth: 'passport' },
    handler: function (request, reply) {
      reply.view('profile', { user: request.user });
    }
  });

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      //validate: {
        //payload: {
          //email: Joi.string().email(),
          //password: Joi.string()
        //}
      //},
      auth: false,
      handler: function(request, reply) {
        passport.authenticate('local-login', {
          successRedirect: '/profile',
          failureRedirect: '/login',
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
