function IDLApp(title, url, icon, collection) {
	this.title = title || '';
	this.url = url || '';
	this.icon = icon || '';
	this.collection = collecion || '';
};

function IDLCollection(title, idlApps) {
	this.title = title || '';
	this.IDLApps = idlApps || [];
};