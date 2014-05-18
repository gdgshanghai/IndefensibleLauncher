// chrome.storage.sync.clear();
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
    DB.loadDB('topHosts', function(data) {
        $('body').trigger('loadTopHost', {
            apps: data
        });
    });
};

var loadCategorizedApps = function() {
    DB.loadDB('topHosts', function(data) {
        $('body').trigger('loadCategorizedApps', {
            apps: data
        });
    });
};

var loadAppsByMode = function(mode) {
    DB.loadDB('topHosts', function(data) {
        var apps = data;
        var ret = [];
        for (var i = 0; i < apps.length; i++) {
            if (data[i].collections.indexOf(mode) != -1) {
                ret.push(apps[i]);
            }
        }
        $('body').trigger('loadAppsByMode', {
            apps: ret
        });
    });
};

var getMapFromApps = function(apps) {
    var map = {};
    for (var i = 0; i < apps.length; i++) {
        var c = apps[i].initial;
        if (typeof map[c] === 'undefined') {
            map[c] = [];
        }
        map[c].push(apps[i]);
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
    var apps = topHosts;

    for (var i = 0; i < CATEGORY.length; i++) {
        var category = CATEGORY[i];
        var listDomStr = '';
        for (var j = 0; j < apps.length; j++) {
            if (topHosts[j].collections.indexOf(category) != -1) {
                listDomStr += genIconWrapperDomStr(apps[j].title, apps[j].url);
            }
        }
        listDomStr += getPlusIconWrapperTmpl();
        ulStr += genCatalogueDom(category, listDomStr);

    }
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
        console.log('loadTopHost===>>>', data);
        var apps = data.apps,
            ulStr = '';
        var sortedHosts = sortMapKeyByInitial(getMapFromApps(apps))
        $.each(sortedHosts, function(k, v) {
            var a = '';
            for (var i = 0; i < v.length; i++) {
                // var icon = '<span class="icon-small"><img src="http://' + v[i] + '/favicon.ico"></span>';
                var icon = '<span class="icon-small"><img src="../images/icons/' + v[i].title + '.jpg"></span>';
                var label = '<br><span class="icon-label">' + v[i].title + '</span>';
                a += ('<a class="icon-wrapper" href="http://' + v[i].url + '">' + icon + label + '</a>');
            }
            ulStr += ('<li><span class="initial">' + k + '</span>' + a + '</li>');
        });
        var header = '<div class="li-header"><img class="AZ" src="images/AZ.png"/></div>'
        ulStr = header + '<ul>' + ulStr + '</ul>';
        $('#launcher-3 .left-block').html(ulStr);
    });

    $('body').on('loadCategorizedApps', function(e, data) {
        var apps = data.apps,
            ulStr = genCatalogueListDomStr(apps);
        $('#launcher-2 .left-block').html(ulStr);

        DB.loadDB('topHosts', function(data) {
            var apps = data,
                ulStr = '';
            var sortedHosts = sortMapKeyByInitial(getMapFromApps(apps));
            var a = ''
            $.each(sortedHosts, function(k, v) {
                for (var i = 0; i < v.length; i++) {
                    var icon = '<span class="icon-small"><img src="../images/icons/' + v[i].title + '.jpg"></span>';
                    var label = '<br><span class="icon-label">' + v[i].title + '</span>';
                    a += ('<a class="icon-wrapper" href="http://' + v[i].url + '">' + icon + label + '</a>');
                }
            });
            $('#launcher-2 .from-az').html(a);
            $('.icon-wrapper:not(.icon-add-wrapper)', '#launcher-2 .from-az').draggable({
                containment: 'document',
                revert: 'invalid',
                helper: 'clone',
            });
            $('.app-collection', '#launcher-2').droppable({
                accept: '#launcher-2 .from-az .icon-wrapper',
                hoverClass: 'icon-hover',
                drop: function(event, ui) {
                    var $idlApp = ui.draggable.clone();
                    var title = $idlApp.find('.icon-label').text();
                    var appObj = {};
                    for (var i = 0; i < apps.length; i++) {
                        if (apps[i].title === title) {
                            appObj = apps[i];
                            break;
                        }
                    }
                    var app = IDLApp.load(appObj);
                    var collection = $(this).data('collection');
                    if (app.addCollection(collection)) {
                        $idlApp.insertBefore($(this).find('.icon-add-wrapper'));
                        for (var i = 0; i < apps.length; i++) {
                            if (apps[i].title === app.title) {
                                apps[i] = app;
                                break;
                            }
                        }
                        DB.saveDB('topHosts', apps, function() {
                            console.log('add', collection, 'to', app.title, 'and saved');
                        });
                    }
                }
            });
        });
    });

    $('body').on('loadAppsByMode', function(e, data) {
        $('body').removeClass().addClass(MODE + '-bg');
        var apps = data.apps;
        var ulStr = '';
        for (var i = 0; i < apps.length; i++) {
            var img = '<img src="../images/homepageicons/' + apps[i].title + '.png">',
                label = '<span class="icon-label">' + apps[i].title + '</span>';
            ulStr += ('<a class="icon-wrapper" href="http://' + apps[i].url + '"><span class="icon-large">' + img + '</span></a>');
        }
        ulStr = '<ul>' + ulStr + '</ul>';
        $('#launcher-1 .apps').html(ulStr);
    });

    loadAppsByMode(MODE);

});
