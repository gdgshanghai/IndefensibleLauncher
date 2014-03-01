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
};

var refreshMode = function() {
    setHighlightByMode(MODE);
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

var initDemoTimeBox = function() {
    $('#current-button').text("现在是" + currentTime().getHours() + ":" + currentTime().getMinutes());
}

$(function() {
    MODE = getMode(currentTime());
    refreshMode();
    displayTime();
    initDemoTimeBox();
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
    });
    $('.set-time').click(function() {
        var MAP = {
            'morning': '上午',
            'afternoon': '下午',
            'night': '晚上'
        }
        var id = $(this).attr('id');
        MODE = id === 'night' ? 'home' : 'work';
        $('#current-button').text("现在是" + MAP[id]);
        refreshMode();
    });
});
