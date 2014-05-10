var IDLApp = function() {
	this.title = '';
	this.url = '';
	this.initial = '';
	this.icon = '';
	this.collection = '';
};

IDLApp.prototype.init = function(url) {
	if (url) {
		this.url = url;
		this.title = url.replace(TOP_LEVEL_DOMAIN_PATTERN, '');
	}
	return this;
};

IDLCollection = function(title) {
	this.title = title || '';
	this.apps = {};
};

IDLCollection.prototype.add = function(app) {
	var title = app.title;
	if (!this.apps.hasOwnProperty(title)) {
		this.apps[title] = app;
	}
	return this;
};

IDLCollection.prototype.save = function(callback) {
	AllCollection.save(this);
};

var AllCollection = {
	dbname: 'IDLCollections',
	collections: {},

	len: function() {
		var i = 0;
		for (key in this.collections) {
			i++;
		}
		return i;
	},

	init: function() {
		DB.loadDB(this.dbname, function(db) {
			for (colTitle in db) {
				this.collections[colTitle] = db[colTitle];
			}
		}.bind(this));
	},

	save: function(collection, callback) {
		if (typeof collection !== 'undefined') {
			this.collections[collection.title] = collection;
		}
		DB.saveDB(this.dbname, this.collections, callback);
	},

	find: function(title) {
		return this.collections[title] || {};
	},

	findAll: function() {
		return this.collections;
	}
};
