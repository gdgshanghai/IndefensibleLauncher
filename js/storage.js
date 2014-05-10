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

	var saveToDB = function(name, key, obj, callback) {
		var dn = dbname(name);
		storage.get(dn, function(s) {
			if (typeof s[dn] === 'undefined') {
				s[dn] = {};
			}
			var db = s[dn];
			db[key] = obj;
			storage.set(s, function() {
				callback && callback();
			});
		});
	};

	var loadFromDB = function(name, key, callback) {
		var dn = dbname(name);
		storage.get(dn, function(s) {
			var db = s[dn] || {};
			callback && callback(db[key]);
		})
	};

	exports.__setPrefix = __setPrefix;
	exports.saveToDB = saveToDB;
	exports.loadFromDB = loadFromDB;
})(DB);
