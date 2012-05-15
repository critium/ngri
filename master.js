var yaml   = require('yaml');
var fs     = require('fs');
var EventEmitter = require('events').EventEmitter;
var db     = require('./redis.js').db;
var logger = require('tracer').console({
  format : "[{{timestamp}} <{{title}}> in {{file}}:{{line}}] {{message}} ",
  dateformat : "HH:MM:ss.L"
});

var events = new EventEmitter();

// declare the function.
var master = function(){
  events.on('slaveready', function(){
    logger.log('a slave is ready');
  });
};

master.bootstrapDB = function(path, success, fail){
  if (!path)
    throw new Error('provide path to yaml file')

  fs.readFile(path, function(err, fileContents) {
    fileContents = fileContents.toString()
    console.log('\n')
    console.log(fileContents)
    console.log('\noutputs:\n')
    console.log(yaml.eval(fileContents))
  })

  logger.log(db);
  db.testClient.call(db, 10);
  db.events.on('error', function() {
    logger.log('error on connecting to db, timeout exceeded');
    fail();
  });
  db.events.on('ready', function() {
    logger.log('success on connecting to db');
    success();
  });
};

// quick system check.
//   num cpus
//   arch type
//   arch name
//   check if datastore is available.
// start datastore
// check slave status
// Does a quick system check on local store
// Does a quick system check on the slave nodes.
// Connects to remote master.
master.bootstrap = function(){
  // checking the datastore
  this.bootstrapDB(
      './redis.yml',
      function(){
        events.emit('dbready');
      },
      function(){
        events.emit('dbfail');
      });
};


master.events = events;
exports.master = master;
