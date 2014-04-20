/// var xhr = new XMLHttpRequest();
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
var ACCESS;

var currentTime = function() {
    return new Date();
};

var getMode = function(time) {
    var h = time.getHours();
    if (h >= FIVE_PM || h < NINE_AM) {
        return MODE_HOME;
    } else {
        return MODE_WORK;
    }
    return MODE_DEFAULT;
};

var refreshMode = function() {
    setHighlightByMode(MODE);
    setMingdao(MODE);
};

var setMingdao = function(mode) {
    if (mode === MODE_HOME) {
        $('#mingdao-block').hide();
    } else {
        $('#mingdao-block').show();
    }
}

var displayTime = function(t) {
    $('#current-time').text(t.toTimeString().substring(0, 5));
};

var countTime = function(t) {
    displayTime(t);
    var leftSecond = 60 - t.getSeconds();
    setTimeout(function() {
        countTime(new Date());
    }, leftSecond * 1000);
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
    chrome.storage.sync.get('topCategorizedApps', function(data) {
        $('body').trigger('loadCategorizedApps', data);
    });
};

var loadAppsByMode = function(mode) {
    chrome.storage.sync.get('topCategorizedApps', function(data) {
        console.log("abc:" + data.topCategorizedApps[mode]);
        var a = data.topCategorizedApps[mode];
        $('body').trigger('loadAppsByMode', {
            apps: data.topCategorizedApps[mode]
        });
    });
};

var getMapFromHostList = function(hosts) {
    var map = {};
    for (var i = 0; i < hosts.length; i++) {
        var c = hosts[i].charAt(0).toUpperCase();
        if (typeof map[c] === 'undefined') {
            map[c] = [];
        }
        map[c].push(hosts[i]);
    }
    return map;
};

var sortMapKeyByInitial = function(map) {
    var keys = [];
    var sorted_map = {};
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    keys.sort();

    $.each(keys, function(i, key) {
        var val = map[key];
        sorted_map[key] = val;
    });
    return sorted_map;
};

var openWindow = function(url) {
    chrome.windows.create({
        'url': url,
        'type': 'popup'
    }, function(window) {
        var id = window.id;
        chrome.windows.onRemoved.addListener(function(windowId) {
            if (windowId === id) {
                console.log(id + 'closed');
                $('body').trigger('closeWindow');
            }
        });
    });
}

$(function() {
    MODE = getMode(currentTime());
    refreshMode();
    countTime(currentTime());
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $(this).addClass('current').siblings().removeClass('current');
        $('#' + id).show('slow').siblings('.launcher-content').hide();
    });
    $('#tab-1').click(function() {
        loadAppsByMode(MODE);
    });
    $('#tab-2').click(function() {
        $('body').removeClass().addClass('yellow-bg');
        loadCategorizedApps();
    });
    $('#tab-3').click(function() {
        $('body').removeClass().addClass('blue-bg');
        loadTopHost();
    });

    $('body').on('loadTopHost', function(e, data) {
        var topHosts = data.topHosts,
            ulStr = '';
        var sortedHosts = sortMapKeyByInitial(getMapFromHostList(topHosts))
        $.each(sortedHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                // var icon = '<span class="icon-small"><img src="http://' + v[i] + '/favicon.ico"></span>';
                var icon = '<span class="icon-small"><img src="../images/icons/' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '.jpg"></span>';
                var label = '<br><span class="icon-label">' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '</span>';
                a += ('<a class="icon-wrapper" target="_blank" href="http://' + v[i] + '">' + icon + label + '</a>');
            }
            ulStr += ('<li><span class="initial">' + k + '</span>' + a + '</li>');
        });
        var header = '<div class="li-header"><img class="AZ" src="images/AZ.png"/></div>'
        ulStr = header + '<ul>' + ulStr + '</ul>';
        $('#launcher-3 .left-block').html(ulStr);
    });

    $('body').on('loadCategorizedApps', function(e, data) {
        var topHosts = data.topCategorizedApps,
            ulStr = '';
        $.each(topHosts, function(k, v) {
            console.log(k);
            console.log('v:' + v);
            var a = '';
            for (var i = 0; i < v.length; i++) {
                var icon = '<span class="icon-small"><img src="../images/icons/' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '.jpg"></span>';
                var label = '<br><span class="icon-label">' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '</span>';
                a += ('<a class="icon-wrapper" target="_blank" href="http://' + v[i] + '">' + icon + label + '</a>');
            }
            var addApp = '<div class="icon-wrapper"><span class="icon-add"><img class="add-new-app" src="../images/add.png"/></span></div>';
            a += addApp;
            arrow_div = '<div class="arrow"></div>';
            ulStr += ('<li><span class="initial categorized-initial"><img src="../images/' + k + 'logo.png"></span>' + a + arrow_div + '</li>');
        });
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-2 .left-block').html(ulStr);
    });

    $('body').on('loadAppsByMode', function(e, data) {
        $('body').removeClass().addClass(MODE + '-bg');
        var apps = data.apps;
        var ulStr = '';
        for (var i = 0; i < apps.length; i++) {
            var img = '<img src="../images/homepageicons/' + apps[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '.png">',
                label = '<span class="icon-label">' + apps[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en|\.tv|\.net/g, '') + '</span>';
            ulStr += ('<a class="icon-wrapper" target="_blank" href="http://' + apps[i] + '"><span class="icon-large">' + img + '</span></a>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-1 .apps').html(ulStr);
    });

    $('body').on('click', function(e) {
        if (e.target.className === 'add-new-app') {
            console.log(e.clientX, e.clientY);
            $('#tuijian').css('top', e.clientY - 75);
            $('#tuijian').css('left', e.clientX + 20);
            $('#tuijian').show();
        } else {
            $('#tuijian').hide();
        }
    });

    loadAppsByMode(MODE);

    // chrome.location.watchLocation('getLocation', {});
    // chrome.location.onLocationUpdate.addListener(function(position) {
    //     console.log('fire onLocationUpdate');
    //     console.log(JSON.stringify(position));
    // });
});
