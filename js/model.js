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

IDLCollection = function() {
	this.title = '';
	this.apps = {};
};

IDLCollection.prototype.add = function(app) {
	var title = app.title;
	console.log('======================')
	console.log(this.apps);
	console.log(this.apps.hasOwnProperty(title));
	if (!this.apps.hasOwnProperty(title)) {
		this.apps[title] = app;
	}
	console.log(this);
	return this;
};

IDLCollection.prototype.save = function() {
	DB.saveToStorage(this.title + 'Collection', this);
};
