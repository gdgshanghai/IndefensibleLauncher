describe('IDLApp', function() {
	describe('init with url', function() {

		var app;

		beforeEach(function() {
			app = new IDLApp();
		});

		it('should set correct url', function() {
			app.init('baidu.com');
			app.url.should.be.equal('baidu.com');

			app.init('jqueryui.com');
			app.url.should.be.equal('jqueryui.com');
		});

		it('should set correct title', function() {
			app.init('baidu.com');
			app.title.should.be.equal('baidu');

			app.init('google.com.hk');
			app.title.should.be.equal('google');

			app.init('devdocs.io')
			app.title.should.be.equal('devdocs');

			app.init('bilibili.tv');
			app.title.should.be.equal('bilibili');

			// app.init('localhost:8080');
			// app.title.should.be.equal('localhost');
		});

	});

	describe('init with collection', function() {
		it('should correct init with collection', function() {
			var app = new IDLApp('google.com', ['news', 'finance']);
			app.collection.length.should.be.equal(2);
			app.collection.should.containEql('news');
			app.collection.should.containEql('finance');
		});
	});

	describe('add new collection to an app', function() {
		// var app;

		// beforeEach(function() {
		// 	app = new IDLApp();
		// });

		it('should correctly add new collection to an app if the app don\'t have the collection', function() {
			var app = new IDLApp('google.com', ['news', 'finance']);
			app.AddCollection('game');
			app.collection.length.should.be.equal(3);
			app.collection.should.containEql('news');
			app.collection.should.containEql('finance');
			app.collection.should.containEql('game');
		});

		it('should do nothing if the app do have the collection', function() {
			var app = new IDLApp('google.com', ['news', 'finance']);
			app.AddCollection('news');
			app.collection.length.should.be.equal(2);
			app.collection.should.containEql('news');
			app.collection.should.containEql('finance');
		});

	});

	// describe('load', function() {
	// 	var appObject = {
	// 		title: 'google',
	// 		url: 'google.com',
	// 		initial: 'g',
	// 		icon: ''
	// 	};

	// 	it('should create new app instance of IDLApp', function() {
	// 		var app = IDLApp.load(appObject);
	// 		app.should.be.instanceOf(IDLApp);
	// 	})
	// });


});
