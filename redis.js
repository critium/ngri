var redis = require("redis");
var EventEmitter = require('events').EventEmitter;
var logger = require('tracer').console();
var events = new EventEmitter();
var client;
var states = {
  "waiting": "waiting for my rocket to come",
  "error": "error",
  "ready": "ready"
}
var db = function(){
};

db.testClient = function(){
  var seconds = 10;
  try {
    var state = states.waiting;
    var emitstate = function(){
      logger.log('db connection test state:' + state);
      events.emit(state);
      try {
        client.end();
      } catch (err){
        logger.log(err);
      }
    };
    var timeoutId = setTimeout(emitstate, seconds*1000);

    client = redis.createClient();
    client.on('error', function (err) {
      // logger.log('ie:' + state);
      state = states.error;
    });

    client.on('ready', function(err) {
      // logger.log('ir:' + state);
      state = states.ready;
      clearTimeout(timeoutId);
      emitstate();
    });

  } catch (err) {
    logger.log('cannot connect to server');
  }
};

db.events = events;
exports.db = db;



// db.testClient(10);



// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     logger.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         logger.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });

