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
    chrome.storage.sync.get('topCategorizedApps', function(data) {
        $('body').trigger('loadCategorizedApps', data);
    });
};

var loadAppsByMode = function(mode) {
    chrome.storage.sync.get('topCategorizedApps', function(data) {
        console.log("abc:"+data.topCategorizedApps[mode]);
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
                $('body').trigger('closeWindow');
            }
        });
    });
}

var getCookie = function() {
    chrome.cookies.get({
        url: "http://memberappwebservice.duapp.com/api/mingdao/index",
        name: "MINGDAO_ACCESSTOKEN"
    }, function(c) {
        console.log(c);
        $('body').trigger('mingdaoCookie', c);
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
        $(this).addClass('current').siblings().removeClass('current');
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

    $('body').on('mingdaoCookie', function(e, c) {
        if (c) {
            $('#mingdao-block').off('click');
            $('#mingdao-block').removeClass('entrance');
            MINGDAO_ACCESSTOKEN = c.value;
            $.ajax({
                url: 'https://api.mingdao.com/task/my_joined?access_token=' + MINGDAO_ACCESSTOKEN + '&format=json',
                type: 'get'
            }).done(function(data) {
                $('body').trigger('mingdaoTask', data);
            });
        } else {
            $('#mingdao-block').on('click', function() {
                openWindow('http://memberappwebservice.duapp.com/api/mingdao/index');
            });
            $('#mingdao-block').addClass('entrance');
        }
    });

    $('body').on('mingdaoTask', function(e, data) {
        var d = JSON.parse(data);
        var tasks = d.tasks;
        var ulStr = '';
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var user = '<span>' + task.user.name + ' - </span>',
                title = '<strong>' + task.title + '</strong>';
            var dueTime = '';
            if (task.expire_date || task.expire_date !== '') {
                dueTime = '<br/><span class="expire-date">到期时间: ' + task.expire_date + '</span>';
            }
            var a = '<a target="_blank" href="https://www.mingdao.com/apps/taskcenter/task_' + task.guid + '">' + user + title + dueTime + '</a>';
            ulStr += ('<li>' + a + '</li>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#mingdao-block').html(ulStr);
    });

    $('body').on('closeWindow', function(e) {
        getCookie();
    });

    loadAppsByMode(MODE);

    getCookie();

    // chrome.location.watchLocation('getLocation', {});
    // chrome.location.onLocationUpdate.addListener(function(position) {
    //     console.log('fire onLocationUpdate');
    //     console.log(JSON.stringify(position));
    // });
});
