var testGetMode = function() {
    var d = new Date(2014, 2, 1, 6);
    var mode = getMode(d);
    console.log('6:00 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 8, 59);
    mode = getMode(d);
    console.log('8:59 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 9);
    mode = getMode(d);
    console.log('9:00 ' + (mode === 'work'));

    d = new Date(2014, 2, 1, 10);
    mode = getMode(d);
    console.log('16:00 ' + (mode === 'work'));

    d = new Date(2014, 2, 1, 17);
    mode = getMode(d);
    console.log('17:00 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 17, 1);
    mode = getMode(d);
    console.log('17:01 ' + (mode === 'home'));
};

var testSortMap = function() {
    var beforeSorted = {
        '1': ['1','2','5'],
        'P': ['p1','p2','p3'],
        'Z': ['z1','z2','z3'],
        'A': ['a1','a2','a3']
    },
    expected = {
        '1': ['1','2','5'],
        'A': ['a1','a2','a3'],
        'P': ['p1','p2','p3'],
        'Z': ['z1','z2','z3']
    };
    var actual = sortMapKeyByInitial(beforeSorted);
    console.log(JSON.stringify(expected) === JSON.stringify(actual));
};

var testGetDianPingJson = function(){
    getJson('http://shaman.incstage.com:8080/indefensible-launcher/api/dianping/veneus');
};
