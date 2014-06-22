'use strict';

require('./configure'); // initializing parameters
var beans = require('nconf').get('beans');
var membersPersistence = beans.get('membersPersistence');
var Member = beans.get('member');

var async = require('async');

var really = process.argv[2];

if (!really || really !== 'really') {
  console.log('If you really want to init the db, append "really" to the command line.');
  process.exit();
}

function logResult(err, message) {
  if (err) { return console.log('An error occurred: ' + err); }
  console.log(message);
}

var members = [
  {id: 'auth01', nickname: 'Testi', firstname: 'Ich', lastname: 'Tester', email: 'test@me.de', location: 'Hier', profession: 'Testbeauftragter'},
  {id: 'auth02', nickname: 'Schumi', firstname: 'Michael', lastname: 'Schumacher', email: 'michael@schumacher.de', location: 'Hürth', profession: 'Ex-Rennfahrer'},
  {id: 'auth03', nickname: 'Balli', firstname: 'Michael', lastname: 'Ballack', email: 'michael@ballack.de', location: 'Görlitz', profession: 'Ex-Fußballer'},
  {id: 'auth04', nickname: 'Jamie', firstname: 'James', lastname: 'Hetfield', email: 'james@hetfield.com', location: 'Downey, LA', profession: 'Musiker'}
];
async.map(members, function (member, callback) {
  membersPersistence.getById(member.id, function (err, existingMember) {
    if (existingMember) {return callback(null, 'Member "' + member.nickname + '" (already existing)'); }
    membersPersistence.save(new Member(member).state, function (err) {
      callback(err, 'Member "' + member.id + '"');
    });
  });
}, function (err, results) {
  console.log('Filling the database...');
  logResult(err, results.join(', '));
  console.log('were created.');
  process.exit();
});


