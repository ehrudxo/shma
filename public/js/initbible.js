var kbible1950;
var bibleInit = function(){
  kbible1950={};
  kbible1950.indexedDB = {};
}
var bibleInstall = function(callback){
  var open = function(){
    kbible1950.indexedDB.db = null;

    kbible1950.indexedDB.open = function() {
      var version = 1;
      var request = indexedDB.open("kbible", version);

      request.onsuccess = function(e) {
        kbible1950.indexedDB.db = e.target.result;
        // Do some more stuff in a minute
        callback( kbible1950.indexedDB.db );
      };

      request.onerror = kbible1950.indexedDB.onerror;
    };
  }

}
