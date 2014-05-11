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
