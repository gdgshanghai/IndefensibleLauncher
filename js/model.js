var IDLApp = function() {
	this.title = '';
	this.url = '';
	this.initial = '';
	this.icon = '';
};

IDLApp.load = function(app) {
	var a = new IDLApp();
	for (var attr in app) {
		a[attr] = app[attr];
	}
	return a;
};

IDLApp.prototype.init = function(url) {
	if (url) {
		this.url = url;
		this.title = url.replace(TOP_LEVEL_DOMAIN_PATTERN, '');
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

IDLCollection = function(title) {
	this.title = title || '';
	this.apps = {};
};

IDLCollection.load = function(collection) {
	var col = new IDLCollection();
	for (var attr in collection) {
		if (attr === 'apps') {
			var apps = collection[attr];
			for (var name in apps) {
				col.add(IDLApp.load(apps[name]));
			}
		} else {
			col[attr] = collection[attr];
		}
	}
	return col;
}

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
	inited: false,
	collections: {},

	len: function() {
		var i = 0;
		for (var key in this.collections) {
			i++;
		}
		return i;
	},

	init: function() {
		DB.loadDB(this.dbname, function(db) {
			for (var colTitle in db) {
				this.collections[colTitle] = IDLCollection.load(db[colTitle]);
			}
			this.inited = true;
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
