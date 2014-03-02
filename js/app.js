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
    $('body').trigger('loadCategorizedApps', mockdata.category);
};

var loadAppsByMode = function(mode) {
    $('body').trigger('loadAppsByMode', {
        apps: mockdata.category[mode]
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

var openWindow = function(url) {
    chrome.windows.create({
        'url': url,
        'type': 'popup'
    }, function(window) {
        var id = window.id;
        chrome.windows.onRemoved.addListener(function(windowId) {
            if (windowId === id) {
                console.log(id + 'closed');
            }
        });
    });
}

var getCookie = function() {
    chrome.cookies.get({
        url: "http://192.168.2.165:8080/Membership-application/api/dianping/accesstoken",
        name: "COOKIENAME"
    }, function(c) {
        console.log(c);
        // call mingdao in main UI
    })
}

var getTodoList = function(accessToken) {
    //https://api.mingdao.com/task/my_joined?access_token=b0a4216f16ec413bb40aa86bcd9bcc86&format=json
}

var getNearVenus = function(long, lat) {
    var url = "http://192.168.2.165:8080/Membership-application/api/dianping/business?latitude=31.18268013000488&longitude=121.42769622802734";
    $.ajax({
        url: url,
        type: "GET",
    }).done(function(data) {
        console.log(data);
    });
}



$(function() {
    MODE = getMode(currentTime());
    refreshMode();
    countTime(currentTime());
    $(".tab-switcher").click(function() {
        var id = $(this).attr('id');
        id = id.replace('tab', 'launcher');
        $('#' + id).show().siblings('.launcher-content').hide();
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
        var sortedHosts = sortObjectByKey(getMapFromHostList(topHosts))
        $.each(sortedHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                var icon = '<span class="icon-small"><img src="http://' + v[i] + '/favicon.ico"></span>';
                var label = '<br><span class="icon-label">' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en/g, '') + '</span>';
                a += ('<a class="icon-wrapper" target="_blank" href="http://' + v[i] + '">' + icon + label + '</a>');
            }
            ulStr += ('<li><span class="initial">' + k + '</span>' + a + '</li>');
        });
        var header = '<div class="li-header"><img class="AZ" src="images/AZ.png"/></div>'
        ulStr = header + '<ul>' + ulStr + '</ul>';
        $('#launcher-3 .left-block').html(ulStr);
    });
    $('body').on('loadCategorizedApps', function(e, data) {
        var topHosts = data,
            ulStr = '';
        $.each(topHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                var icon = '<span class="icon-small"><img src="http://' + v[i] + '/favicon.ico"></span>';
                var label = '<br><span class="icon-label">' + v[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en/g, '') + '</span>';
                a += ('<a class="icon-wrapper" target="_blank" href="http://' + v[i] + '">' + icon + label + '</a>');
            }
            ulStr += ('<li><span class="initial">' + k + '</span>' + a + '</li>');
        });
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-2 .left-block').html(ulStr);
    });
    $('body').on('loadAppsByMode', function(e, data) {
        $('body').removeClass().addClass(MODE + '-bg');
        var apps = data.apps;
        var ulStr = '';
        for (var i = 0; i < apps.length; i++) {
            var img = '<img src="http://' + apps[i] + '/favicon.ico">',
                label = '<span class="icon-label">' + apps[i].replace(/\.com|\.cn|\.io|\.org|\.hk|\.jp|\.en/g, '') + '</span>';
            ulStr += ('<a class="icon-wrapper" target="_blank" href="http://' + apps[i] + '"><span class="icon-large">' + img + label + '</span></a>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-1 .apps').html(ulStr);
    });

    $('#mingdao-block').click(function() {
        openWindow('http://google.com');
    });

    loadAppsByMode(MODE);

    // chrome.location.watchLocation('getLocation', {});
    // chrome.location.onLocationUpdate.addListener(function(position) {
    //     console.log('fire onLocationUpdate');
    //     console.log(JSON.stringify(position));
    // });
});
