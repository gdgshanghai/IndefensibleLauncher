var IDLApp = function() {
	this.title = '';
	this.url = '';
	this.initial = '';
	this.icon = '';
	this.collection = '';
};

IDLApp.prototype.init = function(idlApp) {
	if (idlApp) {
		this.load(idlApp);
	}
	return this;
};

IDLApp.prototype.load = function(idlApp) {
	for (name in idlApp) {
		if (idlApp.hasOwnProperty(name)) {
			this[name] = idlApp[name];
		}
	}
	return this;
};

IDLApp.prototype.equal = function(idlApp) {
	for (name in this) {
		if (this.hasOwnProperty(name) && this[name] !== idlApp[name]) {
			return false;
		}
	}
	return true;
};

IDLCollection = function() {
	this.title = '';
	this.IDLApps = [];
};

IDLCollection.prototype.hasApp = function(idlApp) {
	for (var i = 0; i < this.IDLApps.length; i++) {
		if (IDLApps[i].equal(idlApp)) {
			return true;
		}
	}
	return false;
};

IDLCollection.prototype.indexOfByTitle = function(appTitle) {
	for (var i = 0, len = this.IDLApps.length; i < len; i++) {
		if (IDLApps[i].title === appTitle) {
			return i;
		}
	}
	return -1;
};

IDLCollection.prototype.addApp = function(idlApp) {
	if (!this.hasApp(idlApp)) {
		this.IDLApps.push(idlApp);
	}
	return this;
};

IDLCollection.prototype.removeAppByTitle = function(appTitle) {
	var i = this.indexOfByTitle(appTitle);
	if (i > -1) {
		this.IDLApps = Array.splice.call(this.IDLApps, i, 1);
	}
	return this;
};
