var DB = window.DB || {};

(function(exports) {
	var storage = chrome.storage.sync;
	var PREFIX = 'IDL';

	var dbname = function(name) {
		return PREFIX + '.' + name;
	};

	// only used for unit test
	var __setPrefix = function(prefix) {
		PREFIX = prefix;
	};

	var saveDB = function(name, db, callback) {
		var dn = dbname(name);
		storage.get(dn, function(s) {
			s[dn] = db;
			storage.set(s, function() {
				callback && callback();
			});
		});
	};

	var loadDB = function(name, callback) {
		var dn = dbname(name);
		storage.get(dn, function(s) {
			var db = s[dn] || {};
			callback && callback(db);
		})
	};

	exports.__setPrefix = __setPrefix;
	exports.saveDB = saveDB;
	exports.loadDB = loadDB;
})(DB);
