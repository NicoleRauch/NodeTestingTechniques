'use strict';

var passport = require('passport');

var conf = require('nconf');
var beans = conf.get('beans');
var memberstore = beans.get('memberstore');
var misc = beans.get('misc');

var urlPrefix = conf.get('publicUrlPrefix');

function findOrCreateUser(req, authenticationId, profile, done) {
  process.nextTick(function () {
    if (!req.user) {
      return memberstore.getMemberForAuthentication(authenticationId, function (err, member) {
        if (err) { return done(err); }
        if (!member) { return done(null, { authenticationId: authenticationId, profile: profile }); }
        done(null, {authenticationId: authenticationId, member: member});
      });
    }
    var memberOfSession = req.user.member;
    return memberstore.getMemberForAuthentication(authenticationId, function (err, member) {
      if (err) { return done(err); }
      if (member && memberOfSession.id() !== member.id()) { return done(new Error('Unter dieser Authentifizierung existiert schon ein Mitglied.')); }
      if (member && memberOfSession.id() === member.id()) { return done(null, {authenticationId: authenticationId, member: member}); }
      // no member found
      memberOfSession.addAuthentication(authenticationId);
      memberstore.saveMember(memberOfSession, function (err) {
        if (err) { return done(err); }
        done(null, {authenticationId: authenticationId, member: memberOfSession});
      });
    });
  });
}

function createProviderAuthenticationRoutes(app, provider) {
  function authenticate(provider) {
    return passport.authenticate(provider, { successReturnToOrRedirect: '/', failureRedirect: '/login' });
  }

  function setReturnOnSuccess(req, res, next) {
    if (req.session.returnTo === undefined) {
      req.session.returnTo = req.param('returnTo', '/');
    }
    next();
  }

  app.get('/' + provider, setReturnOnSuccess, authenticate(provider));
  app.get('/' + provider + '/callback', authenticate(provider));
}

function setupStrategies(app) {
  var OpenIDStrategy = require('passport-openid').Strategy;
  passport.use(new OpenIDStrategy(
    { // openID can always be used
      returnURL: urlPrefix + '/auth/openid/callback',
      realm: urlPrefix,
      profile: true,
      passReqToCallback: true
    },
    findOrCreateUser
  ));
  createProviderAuthenticationRoutes(app, 'openid');
}

var app = misc.expressAppIn(__dirname);

function serializeUser(user, done) {
  done(null, user);
}

function deserializeUser(user, done) {
  if (user.profile) { return done(null, user); } // new user
  memberstore.getMemberForAuthentication(user.authenticationId, function (err, member) {
    if (err) { return done(err); }
    done(null, {authenticationId: user.authenticationId, member: member});
  });
}

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/goodbye.html');
});
setupStrategies(app);

module.exports = app;
