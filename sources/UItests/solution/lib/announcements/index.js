'use strict';
var moment = require('moment-timezone');

var beans = require('nconf').get('beans');
var misc = beans.get('misc');
var validation = beans.get('validation');
var api = beans.get('announcementsAPI');
var store = beans.get('announcementstore');
var Announcement = beans.get('announcement');

var app = misc.expressAppIn(__dirname);

function announcementSubmitted(req, res, next) {
  var errors = validation.isValidAnnouncement(req.body);
  if (errors.length !== 0) { return res.render('../../../views/errorPages/validationError', {errors: errors}); }

  var announcement = new Announcement(req.body);
  if (!res.locals.accessrights.canEditAnnouncement(announcement)) {
    return res.redirect('/announcements');
  }
  api.saveAnnouncement(announcement, function (err) {
    if (err) { return next(err); }
    res.redirect('/announcements/' + encodeURIComponent(announcement.url));
  });
}

app.get('/', function (req, res, next) {
  store.allAnnouncementsUntilToday(function (err, announcements) {
    if (err) { return next(err); }
    res.render('index', { announcements: announcements });
  });
});

app.get('/new', function (req, res) {
  var announcement = new Announcement();
  announcement.author = req.user.member.id();
  res.render('edit', { announcement: announcement });
});

app.get('/checkurl', function (req, res) {
  misc.validate(req.query.url, req.query.previousUrl, api.isValidUrl, res.end);
});

app.get('/edit/:url', function (req, res, next) {
  store.getAnnouncement(req.params.url, function (err, announcement) {
    if (err || !announcement) { return next(err); }
    if (!res.locals.accessrights.canEditAnnouncement(announcement)) {
      return res.redirect('/announcements/' + encodeURIComponent(req.params.url));
    }
    res.render('edit', { announcement: announcement });
  });
});

app.post('/submit', function (req, res, next) {
  var url = req.body.url;
  var previousUrl = req.body.previousUrl;
  if (url !== previousUrl) {
    return api.isValidUrl(url, function (err, check) {
      if (err || !check) {
        var errors = ['Diese URL ist leider nicht verfügbar.'];
        return res.render('../../../views/errorPages/validationError', {errors: errors});
      }
      announcementSubmitted(req, res, next);
    });
  }
  announcementSubmitted(req, res, next);
});

app.get('/:url', function (req, res, next) {
  store.getAnnouncement(req.params.url, function (err, announcement) {
    if (err || !announcement) { return next(err); }
    api.getAuthorName(announcement, function (err, name) {
      if (err) { return next(err); }
      announcement.authorname = name;
      res.render('get', { announcement: announcement });
    });
  });
});

module.exports = app;
