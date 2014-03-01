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

var testGetDianPingJson = function(){
    getJson('http://192.168.2.165:8080/Membership-application/api/dianping/veneus');
};
