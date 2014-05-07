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
	this.apps = [];
};
