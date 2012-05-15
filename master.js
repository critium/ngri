var yaml = require('yaml');
var fs = require('fs');

// declare the function.
var master = function(){
};

master.bootstrapDB = function(path){
  if (!path)
    throw new Error('provide path to yaml file')

  fs.readFile(path, function(err, fileContents) {
    fileContents = fileContents.toString()
    console.log('\n')
    console.log(fileContents)
    console.log('\noutputs:\n')
    console.log(yaml.eval(fileContents))
  })
};

// quick system check.
//   num cpus
//   arch type
//   arch name
//   check if datastore is available.
// start datastore
// check client status
// Does a quick system check on local store
// Does a quick system check on the child nodes.
// Connects to remote master.
master.bootstrap = function(){
  this.bootstrapDB('./redis.yml');
};

exports.master = master;
