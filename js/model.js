var IDLApp = function() {
	this.title = '';
	this.url = '';
	this.initial = '';
	this.icon = '';
	this.collection = '';
};

IDLApp.prototype.init = function(url) {
	var PATTERN = /.com|.cn|.hk|.io|.org|.me|.tv|.jp/g;
	if (url) {
		this.url = url;
		this.title = url.replace(PATTERN, '');
	}
	return this;
};

IDLCollection = function() {
	this.title = '';
	this.apps = [];
};
