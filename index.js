var heapdump = require('heapdump')
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

var plugin_name = process.argv[2]
switch(plugin_name) {
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

const per = 4; // new()/close() per second
const duration = 5*60; // total test duration

var counter = 0;
const max_counter = 20*per;
const max_waiting = 7*per;
var waiting = max_waiting;
var overall = 0;

var heapUsed = null;

var running = true;

function Measure() {
  global.gc();
  var memory = process.memoryUsage();
  var last_heapUsed = heapUsed;
  heapUsed = memory.heapUsed;

  var difference = 0;
  if(last_heapUsed !== null) {
    difference = heapUsed - last_heapUsed;
  }
  var suffix = '_'+difference+'_'+heapUsed+'.heapsnapshot';

  var filename = 'data/at-'+overall+'-';
  if(waiting > 0) {
    filename += 'waiting';
  } else if(counter < max_counter) {
    filename += 'running-'+counter;
  } else {
    filename += 'done';
  }
  filename += suffix;

  global.gc();
  heapdump.writeSnapshot(filename);
  global.gc();
}

function onMemleakInterval() {

  overall++;

  Measure();

  if(waiting > 0) {
    waiting--;
    setTimeout(onMemleakInterval,1000/per)
    return;
  }

  if(counter < max_counter) {
    counter++;

    var db = new PouchDB('http://127.0.0.1:5984/foo',options);
    db
      .info()
      .then(function infoDone(){
        db
        .close(function closeDone(){
          db = null
          setTimeout(onMemleakInterval,1000/per)
        })
      })
    return
  }
  if(running) {
    setTimeout(onMemleakInterval,1000/per)
  }
};

/* TIME_WAIT will stay for 4 minutes, so wait at least that long */
setTimeout(function onFinalTimeout(){
  running = false
},duration*1000)

setTimeout(onMemleakInterval,1000/per)
