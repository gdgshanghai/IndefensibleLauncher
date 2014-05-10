var DB = window.DB || {};

(function(exports) {
	var storage = chrome.storage.sync;
	var PREFIX = 'IDL';

	var namespace = function(key) {
		return PREFIX + '.' + key;
	};

	// only used for unit test
	var __setPrefix = function(prefix) {
		PREFIX = prefix;
	};

	var saveToStorage = function(key, obj, callback) {
		var o = JSON.stringify(obj);
		var ns = namespace(key);
		storage.set({
			ns: o
		}, function() {
			callback && callback();
		});
	};

	var loadFromStorage = function(key, callback) {
		if (callback) {
			storage.get(namespace(key), function(o) {
				var obj = JSON.parse(o);
				callbackcallback(obj);
			});
		}
	};

	exports.__setPrefix = __setPrefix;
	exports.saveToStorage = saveToStorage;
	exports.loadFromStorage = loadFromStorage;
})(DB);
