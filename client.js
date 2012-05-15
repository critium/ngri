var myWorkerId = process.env.NODE_WORKER_ID;
var myPID = process.pid;

var imhere = function (){
}

imhere.init = function(){
  console.log('client node init invoked');
  console.log('my process id: ' + myPID);
}

exports.imhere = imhere;
