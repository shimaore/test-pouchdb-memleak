/* A dummy, "no memory used" adapter for test purposes. */

function DummyPouch (opts,callback) {
  // console.log('HttpPouch',opts)
  var api = this;

  api.close = function(callback) {
    if(callback) {
      callback()
    } else {
      return Promise.resolve()
    }
  }
  api.info = function(callback) {
    if(callback) {
      callback({dummy:true})
    } else {
      return Promise.resolve({dummy:true})
    }
  }
}

DummyPouch.valid = function() { return true }

module.exports = function (PouchDB) {
  PouchDB.adapter('http', DummyPouch, false)
}
