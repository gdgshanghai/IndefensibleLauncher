// ========================
var CATEGORY = [
	'news',
	'finance',
	'game',
	'home',
	'work',
	'social',
	'shopping'
];

var genRandomCollection = function() {
	var ret = [];
	var len = CATEGORY.length;
	for (var i = 0; i < len; i++) {
		if (Math.random() * 100 < 13.75) {
			ret.push(CATEGORY[i]);
		}
	}
	return ret;
}

// ========================

var IDLApp = function() {
	this.title = '';
	this.url = '';
	this.initial = '';
	this.icon = '';
	this.collections = [];
};

IDLApp.load = function(app) {
	var a = new IDLApp();
	for (var attr in app) {
		a[attr] = app[attr];
	}
	return a;
};

IDLApp.prototype.init = function(url, collections) {
	if (url) {
		this.url = url;
		this.title = url.replace(TOP_LEVEL_DOMAIN_PATTERN, '');
		this.initial = url.charAt(0).toUpperCase();
		this.icon = url + '/favicon.ico';
	}
	if (Array.isArray(collections)) {
		this.collections = collections;
	} else {
		this.collections = genRandomCollection();
		// this.collections = [];
	}
	return this;
};

IDLApp.prototype.addCollection = function(collection) {
	if (this.collections.indexOf(collection) === -1) {
		this.collections.push(collection);
		return true;
	}
	return false;
};

IDLApp.prototype.removeCollection = function(collection) {
	var index = this.collections.indexOf(collection);
	if (index != -1) {
		this.collections.splice(index, 1);
	}
	return this;
};


// IDLApp.prototype.render = function() {
// 	var domain = this.url,
// 		domainName = this.title;

// 	var tmpl = $('#icon-wrapper-tmpl').get(0).innerHTML,
// 		ret = tmpl.replace(/%httpUrl%/g, domain).replace(/%domainName%/g, domainName);

// 	return ret;
// };
