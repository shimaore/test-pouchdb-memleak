var PouchDB = require('pouchdb-core')

var plugin = null

switch(process.argv[2]) {
  case 'http':
    console.log('Using the regular HTTP adapter.')
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

var measure = function() {
  var memory = process.memoryUsage();
  var last_heapUsed = heapUsed;
  heapUsed = memory.heapUsed;

  if (last_heapUsed !== null) {
    console.log('current is',heapUsed,', difference is', heapUsed - last_heapUsed);
  }
}

var run = setInterval(function () {

  global.gc();

  var db = new PouchDB('http://127.0.0.1:5984/foo');
  db
    .info()
    .then(function(){
      db
      .close()
      .then(measure)
    })

}, 1000);

setTimeout(function(){
  clearInterval(run)
},30*1000)
