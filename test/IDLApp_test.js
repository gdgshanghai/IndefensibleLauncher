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
			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.collections.length.should.be.equal(2);
			app.collections.should.containEql('news');
			app.collections.should.containEql('finance');
		});
	});

	describe('add new collection to an app', function() {

		it('should correctly add new collection to an app if the app don\'t have the collection', function() {
			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.addCollection('game');
			app.collections.length.should.be.equal(3);
			app.collections.should.containEql('news');
			app.collections.should.containEql('finance');
			app.collections.should.containEql('game');

			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.addCollection('game');
			app.addCollection('home');
			app.collections.length.should.be.equal(4);
			app.collections.should.containEql('news');
			app.collections.should.containEql('finance');
			app.collections.should.containEql('game');
			app.collections.should.containEql('home');

		});

		it('should do nothing if the app do have the collection', function() {
			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.addCollection('news');
			app.collections.length.should.be.equal(2);
			app.collections.should.containEql('news');
			app.collections.should.containEql('finance');

			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.addCollection('news');
			app.addCollection('home');
			app.collections.length.should.be.equal(3);
			app.collections.should.containEql('news');
			app.collections.should.containEql('home');
			app.collections.should.containEql('finance');
		});

	});

	describe('remove collection from an app', function() {

		it('should remove correctly from an app', function() {

			var app = new IDLApp().init('google.com', ['news', 'finance']);
			app.removeCollection('news');
			app.collections.length.should.be.equal(1);
			app.collections.should.containEql('finance');
			app.collections.should.not.containEql('news');

			var app = new IDLApp().init('google.com', ['news', 'finance', 'game']);
			app.removeCollection('news');
			app.removeCollection('game');
			app.collections.length.should.be.equal(1);
			app.collections.should.containEql('finance');
			app.collections.should.not.containEql('game');
			app.collections.should.not.containEql('news');

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
