var PouchDB = require('pouchdb-core')
var HttpPouch = require('pouchdb-adapter-http')
var DummyPouch = require('./pouchdb-adapter-dummy')

PouchDB.plugin(function(PouchDB) {
  /* The regular HTTP adapter */
  // PouchDB.adapter('http', HttpPouch, false)
  /* A dummy version for comparison purposes */
  PouchDB.adapter('http', DummyPouch, false)
})

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
