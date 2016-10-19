/* A dummy, "no memory used" adapter for test purposes. */

function DummyPouch (opts,callback) {
  // console.log('HttpPouch',opts)
  var api = this;

  api.close = function DummyPouchClose(callback) {
    if(callback) {
      callback()
    } else {
      return Promise.resolve()
    }
  }
  api.info = function DummyPouchInfo(callback) {
    if(callback) {
      callback(null,{dummy:true})
    } else {
      return Promise.resolve({dummy:true})
    }
  }
  setTimeout(function DummyPouchContinue(){callback(null,api)})
}

DummyPouch.valid = function DummyPouchValid() { return true }

module.exports = function DummyPouchPlugin (PouchDB) {
  PouchDB.adapter('http', DummyPouch, false)
}
