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

var _c_dbname = 'IDLCollections';

IDLCollection = function() {
	this.title = '';
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
	DB.saveToDB(_c_dbname, this.title, this, callback);
};
