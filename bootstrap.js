var cluster = require('cluster');
var http    = require('http');
var numCPUs = require('os').cpus().length;
var slave   = require('./slave.js').slave;
var master  = require('./master.js').master;
var logger = require('tracer').console({
  format : "[{{timestamp}} <{{title}}> in {{file}}:{{line}}] {{message}} ",
  dateformat : "HH:MM:ss.L"
});
if (cluster.isMaster) {
  master.bootstrap();
  master.events.on('dbready', function(err){
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
      logger.log("forking worker: " + i + " " + numCPUs);
      cluster.fork();
    }

    cluster.on('death', function(worker) {
      logger.log('worker ' + worker.pid + ' died');
    });
  });

  // master events
  // unimplmemented yet
  master.events.on('allidle');
  master.events.on('alldone');
  master.events.on('poisoned');
  master.events.on('delayed');
  master.events.on('shuttingdown');
  master.events.on('startingup');

  // slave events
  // unimplemented yet
  // slave has completed task
  master.events.on('slavedone', function(){});
  // slave is ready to accept tasks
  master.events.on('slaveready', function(){});
  // slave is waiting for new tasks (same as ready?)
  master.events.on('slaveidle', function(){});
  // slave has failed (recoverable)
  master.events.on('slavefail', function(){});
  // slave has errored (non-recoverable)
  master.events.on('slaveerror', function(){});
  // slave takes a job
  master.events.on('slavetake', function(){});
  // salve puts results back
  master.events.on('slaveput', function(){});

} else {
  slave.init();
}
