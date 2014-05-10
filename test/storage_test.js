describe('storage', function() {
	DB.__setPrefix('IDLTEST');
	var o = {
		title: 'google',
		url: 'google.com',
		initial: 'G',
		icon: '',
		collection: 'work'
	};

	it('should save and load object correct', function() {
		DB.saveToStorage('app', o);
		var loaded = DB.loadFromStorage('app', function(obj) {
			obj.should.be.equal(o);
		});
	});
});
