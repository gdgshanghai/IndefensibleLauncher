describe('IDLCollection', function() {
	var c, app;

	describe('.add()', function() {

		beforeEach(function() {
			c = new IDLCollection();
			app = new IDLApp();
			app.init('google.com');
		});

		it('should add app into collection when app not exist', function() {
			c.add(app);
			c.apps.should.have.property(app.title, app);
		});

		it('should not add app when app is exist', function() {
			c.add(app);
			var app2 = new IDLApp();
			app2.init('google.com');
			app2.icon = '1234';
			c.add(app2);
			c.apps.should.have.property(app.title);
			c.apps[app.title].icon.should.not.be.equal('1234');
		});
	});
});
