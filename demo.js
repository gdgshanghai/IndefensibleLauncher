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

var currentTime = function() {
    return new Date();
};

var displayTime = function() {
    $('#current-time').text(currentTime());
};

var setHighlightByTime = function(time) {

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
    alert(mockData.veneus[1].url);
    displayTime();
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
    });
});
