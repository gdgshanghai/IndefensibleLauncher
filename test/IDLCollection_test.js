describe('IDLCollection', function() {

	var c;

	describe('.add()', function() {

		beforeEach(function() {
			c = new IDLCollection();
		});

		it('should be able to add app', function() {
			var app = new IDLApp().init('google.com');
			c.add(app);
			c.apps.should.have.property(app.url, app);
		});

		it('should have independent apps for each IDLCollection', function() {
			var app = new IDLApp().init('google.com');
			c.add(app);
			c.apps.should.have.property(app.url, app);

			var c2 = new IDLCollection();
			c2.apps.should.not.have.property(app.url);
		});

	});
});
