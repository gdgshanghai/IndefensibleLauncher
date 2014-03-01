// var xhr = new XMLHttpRequest();
// //xhr.open("GET", "https://www.getpostman.com/collections/c594ef706d94e390f5c3", true);
// xhr.open("GET", "http://portal.qiniu.com/", true);
// xhr.onreadystatechange = function() {
//     if (xhr.readyState == 4) {
//         // WARNING! Might be injecting a malicious script!
//         document.getElementById("resp").innerHTML = xhr.responseText;
//     }
// }
// xhr.send();

var MODE;

var currentTime = function() {
    return new Date();
};

var getMode = function(time) {
    var h = time.getHours();
    if (h >= 17 || h < 9) {
        return 'home';
    } else {
        return 'work';
    }
    return 'default';
}

var testGetMode = function() {
    var d = new Date(2014, 2, 1, 6);
    var mode = getMode(d);
    alert('6:00 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 8, 59);
    mode = getMode(d);
    alert('8:59 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 9);
    mode = getMode(d);
    alert('9:00 ' + (mode === 'work'));

    d = new Date(2014, 2, 1, 10);
    mode = getMode(d);
    alert('16:00 ' + (mode === 'work'));

    d = new Date(2014, 2, 1, 17);
    mode = getMode(d);
    alert('17:00 ' + (mode === 'home'));

    d = new Date(2014, 2, 1, 17, 1);
    mode = getMode(d);
    alert('17:01 ' + (mode === 'home'));
};

var displayTime = function() {
    $('#current-time').text(currentTime());
};

var setHighlightByMode = function(mode) {
    $('.context-mode-title#' + mode).addClass('current')
        .siblings('.context-mode-title').removeClass('current');
}

var getJson = function(url) {
    $.ajax({
        url: url
    }).done(function(data) {
        console.log(data);
    }).fail(function(err) {
        console.log(err);
    });
};

var mockData = {
    veneus: [{
        title: 'title1',
        url: 'http://www.google.com'
    }, {
        title: 'title2',
        url: 'http://www.baidu.com'
    }, {
        title: 'title3',
        url: 'http://www.bing.com'
    }]
};

$(function() {
    displayTime();
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
    });
});
