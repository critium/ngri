var cluster = require('cluster');
var http    = require('http');
var numCPUs = require('os').cpus().length;
var client = require('./client.js');
var master = require('./master.js');

if (cluster.isMaster) {
  master.master.bootstrap();

  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    console.log("nc: " + i + " " + numCPUs);
    cluster.fork();
 }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  client.imhere.init();
}
