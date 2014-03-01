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
    if (h >= FIVE_PM || h < NINE_AM) {
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
    $('#current-time').text(currentDisplayTime());
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

var loadTopHost = function() {
    chrome.storage.sync.get('topHosts', function(data) {
        $('body').trigger('loadTopHost', data);
    });
};

$(function() {
    MODE = getMode(currentTime());
    refreshMode();
    displayTime();
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
    });
    $('#tab-3').click(function() {
        $('body').css('background', 'none');
        $('.main-content').css('background', 'none');
        loadTopHost();
    });
    $('body').on('loadTopHost', function(e, data) {
        var topHosts = data.topHosts,
            ulStr = '';
        for (var i = 0; i < topHosts.length; i++) {
            ulStr += ('<li>' + topHosts[i] + '</li>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-3').html(ulStr);
    })
});
