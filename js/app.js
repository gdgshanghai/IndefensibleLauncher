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
};

var getIconWrapperTmpl = function() {
    return $('#icon-wrapper-tmpl').get(0).innerHTML;
};

var genIconWrapperDomStr = function(domainName, domain) {
    var tmpl = getIconWrapperTmpl(),
        ret = tmpl.replace(/%httpUrl%/g, domain).replace(/%domainName%/g, domainName);
    return ret;
};

var getPlusIconWrapperTmpl = function() {
    return $('#plus-icon-wrapper-tmpl').get(0).innerHTML;
};

var getCatalogueTmpl = function() {
    return $('#catalogue-tmpl').get(0).innerHTML;
};

var genCatalogueDom = function(catalogueName, iconsDomStr) {
    var tmpl = getCatalogueTmpl(),
        ret = tmpl.replace(/%catalogueName%/g, catalogueName).replace(/%iconsDomStr%/g, iconsDomStr);
    return ret;
};

var genCatalogueListDomStr = function(topHosts) {
    var ulStr = '';
    $.each(topHosts, function(catalogueName, v) {
        var listDomStr = '';
        for (var i = 0; i < v.length; i++) {
            var domain = v[i],
                domainName = domain.replace(TOP_LEVEL_DOMAIN_PATTERN, '');
            listDomStr += genIconWrapperDomStr(domainName, domain);
        }
        listDomStr += getPlusIconWrapperTmpl();
        ulStr += genCatalogueDom(catalogueName, listDomStr);
    });
    return '<ul>' + ulStr + '</ul>';
};

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
                var icon = '<span class="icon-small"><img src="../images/icons/' + v[i].replace(TOP_LEVEL_DOMAIN_PATTERN, '') + '.jpg"></span>';
                var label = '<br><span class="icon-label">' + v[i].replace(TOP_LEVEL_DOMAIN_PATTERN, '') + '</span>';
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
            ulStr = genCatalogueListDomStr(topHosts);
        $('#launcher-2 .left-block').html(ulStr);
        $('.icon-wrapper', '#launcher-2').draggable({
            containment: 'document',
            revert: true
        });
    });

    $('body').on('loadAppsByMode', function(e, data) {
        $('body').removeClass().addClass(MODE + '-bg');
        var apps = data.apps;
        var ulStr = '';
        for (var i = 0; i < apps.length; i++) {
            var img = '<img src="../images/homepageicons/' + apps[i].replace(TOP_LEVEL_DOMAIN_PATTERN, '') + '.png">',
                label = '<span class="icon-label">' + apps[i].replace(TOP_LEVEL_DOMAIN_PATTERN, '') + '</span>';
            ulStr += ('<a class="icon-wrapper" target="_blank" href="http://' + apps[i] + '"><span class="icon-large">' + img + '</span></a>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-1 .apps').html(ulStr);
    });

    loadAppsByMode(MODE);

});
