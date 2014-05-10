describe('IDLApp', function() {
	describe('app.init(url)', function() {

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

	describe('load', function() {
		var appObject = {
			title: 'google',
			url: 'google.com',
			initial: 'g',
			icon: ''
		};

		it('should create new app instance of IDLApp', function() {
			var app = IDLApp.load(appObject);
			app.should.be.instanceOf(IDLApp);
		})
	})
});
