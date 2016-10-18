var PouchDB = require('pouchdb-core')

var plugin = null
/*
var options = {
  ajax: {
    agentOptions: {
      keepAlive: true
    }
  }
}
*/
/*
var options = {
  ajax: {
    pool: {
      maxSockets: 1
    }
  }
}
*/
var options = {}

switch(process.argv[2]) {
  case 'http':
    console.log('Using the regular HTTP adapter. Options = ',options)
    plugin = require('pouchdb-adapter-http')
    break;
  case 'dummy':
    console.log('Using a dummy adapter for comparison purposes.')
    plugin = require('./pouchdb-adapter-dummy')
    break;
  default:
    console.log('Missing adapter name')
    process.exit(1);
    break
}

PouchDB.plugin(plugin)

var heapUsed = null;

var counter = 0;
var measure = function() {
  var memory = process.memoryUsage();
  var last_heapUsed = heapUsed;
  heapUsed = memory.heapUsed;

  if (last_heapUsed !== null) {
    console.log('current is',heapUsed,', difference is', heapUsed - last_heapUsed, ', counter is',counter);
  }
}

var run = setInterval(function () {

  global.gc();


  if(counter < 120) {
    counter++;

    var db = new PouchDB('http://127.0.0.1:5984/foo',options);
    db
      .info()
      .then(function(){
        db
        .close()
        .then(measure)
      })

  } else {
    measure()
  }
}, 250);

setTimeout(function(){
  clearInterval(run)
},240*1000)
