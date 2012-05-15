var myWorkerId = process.env.NODE_WORKER_ID;
var myPID      = process.pid;
var EventEmitter = require('events').EventEmitter;
var logger = require('tracer').console({
  format : "[{{timestamp}} <{{title}}> in {{file}}:{{line}}] {{message}} ",
  dateformat : "HH:MM:ss.L"
});

var events = new EventEmitter();

var slave = {
}

slave.init = function(){
  logger.log('client node init invoked');
  logger.log('my process id: ' + myPID);
  setInterval(function() {
    logger.log('pid:' + myPID)
  }, 3000);
}

exports.slave = slave;
