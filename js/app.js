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

var loadCategorizedApps = function() {
    $('body').trigger('loadCategorizedApps', mockdata.category);
};

var getMapFromHostList = function(hosts) {
    var map = {};
    for (var i = 0; i < hosts.length; i++) {
        var c = hosts[i].charAt(0).toLowerCase();
        if (typeof map[c] === 'undefined') {
            map[c] = [];
        }
        map[c].push(hosts[i]);
    }
    return map;
};

var sortObjectByKey = function(obj) {
    var keys = [];
    var sorted_obj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    keys.sort();

    $.each(keys, function(i, key) {
        var val = obj[key];
        sorted_obj[key] = val;
    });
    return sorted_obj;
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
    $('#tab-2').click(function() {
        $('body').css('background', 'none');
        $('.main-content').css('background', 'none');
        loadCategorizedApps();
    });
    $('#tab-3').click(function() {
        $('body').css('background', 'none');
        $('.main-content').css('background', 'none');
        loadTopHost();
    });
    $('body').on('loadTopHost', function(e, data) {
        var topHosts = data.topHosts,
            ulStr = '';
        var sortedHosts = sortObjectByKey(getMapFromHostList(topHosts))
        $.each(sortedHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                a += (' <a target="_blank" href="http://' + v[i] + '"">' + v[i] + '</a>');
            }
            ulStr += ('<li>' + k + ': ' + a + '</li>');
        });
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-3').html(ulStr);
    });
    $('body').on('loadCategorizedApps', function(e, data) {
        var topHosts = data,
            ulStr = '';
        // var sortedHosts = sortObjectByKey(getMapFromHostList(topHosts))
        $.each(topHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                a += (' <a target="_blank" href="http://' + v[i] + '"">' + v[i] + '</a>');
            }
            ulStr += ('<li>' + k + ': ' + a + '</li>');
        });
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-2').html(ulStr);
    });
    $('#tab-2').click();
    // chrome.location.watchLocation('getLocation', {});
    // chrome.location.onLocationUpdate.addListener(function(position) {
    //     console.log('fire onLocationUpdate');
    //     console.log(JSON.stringify(position));
    // });
});
