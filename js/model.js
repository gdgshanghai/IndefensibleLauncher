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
	}
	if (Array.isArray(collections)) {
		this.collections = collections;
	}
	return this;
};

IDLApp.prototype.addCollection = function(collection) {
	if (this.collections.indexOf(collection) === -1) {
		this.collections.push(collection);
	}
	return this;
};

IDLApp.prototype.removeCollection = function(collection) {
	var index = this.collections.indexOf(collection);
	if (index != -1) {
		this.collections.splice(index, 1);
	}
	return this;
};


IDLApp.prototype.render = function() {
	var domain = this.url,
		domainName = this.title;

	var tmpl = $('#icon-wrapper-tmpl').get(0).innerHTML,
		ret = tmpl.replace(/%httpUrl%/g, domain).replace(/%domainName%/g, domainName);

	return ret;
};

// var Collection = function() {
// 	this.apps = {};
// };

// Collection.prototype.add = function(app) {
// 	var key = app.url;
// 	this.apps[key] = app;
// 	return this;
// };

// var IDLCollection = function(title) {
// 	this.title = title || '';
// 	this.apps = {};
// };

// IDLCollection.prototype = (function() {
// 	var C = new Collection();
// 	return Object.create(C)
// })();

// IDLCollection.load = function(colData) {
// 	var col = new IDLCollection();
// 	for (var attr in colData) {
// 		if (attr === 'apps') {
// 			var apps = colData[attr];
// 			for (var name in apps) {
// 				col.add(IDLApp.load(apps[name]));
// 			}
// 		} else {
// 			col[attr] = colData[attr];
// 		}
// 	}
// 	return col;
// };

// IDLCollection.prototype.save = function(callback) {
// 	AllIDLCollection.save(this);
// };

// IDLCollection.prototype.render = function() {
// 	var listDomStr = '';
// 	for (var title in this.apps) {
// 		listDomStr += this.apps[title].render();
// 	}
// 	var tmpl = $('#catalogue-tmpl').get(0).innerHTML,
// 		ret = tmpl.replace(/%catalogueName%/g, this.title).replace(/%iconsDomStr%/g, listDomStr);
// 	return ret;
// };

// var AZCollection = function(initial) {
// 	this.initial = initial || '';
// 	this.apps = {};
// };

// IDLCollection.prototype = new Collection();

// var AllCollection = function(dbname) {
// 	if (typeof dbname !== 'string' && dbname !== '') {
// 		throw ('[new AllCollection] invalid dbname');
// 	}
// 	this.dbname = dbname;
// 	this.inited = false;
// 	this.collections = {};
// };

// AllCollection.prototype.len = function() {
// 	var i = 0;
// 	for (var key in this.collections) {
// 		i++;
// 	}
// 	return i;
// };

// AllCollection.prototype.init = function() {
// 	DB.loadDB(this.dbname, function(db) {
// 		for (var colTitle in db) {
// 			this.collections[colTitle] = IDLCollection.load(db[colTitle]);
// 		}
// 		this.inited = true;
// 	}.bind(this));
// };

// AllCollection.prototype.save = function(collection, callback) {
// 	if (typeof collection !== 'undefined') {
// 		this.collections[collection.title] = collection;
// 	}
// 	DB.saveDB(this.dbname, this.collections, callback);
// };

// AllCollection.prototype.find = function(title) {
// 	return this.collections[title] || {};
// };

// AllCollection.prototype.findAll = function() {
// 	return this.collections;
// };

// var AllIDLCollection = new AllCollection('IDLCollections');
// var AllAZColleciton = new AllCollection('AZCollections');
