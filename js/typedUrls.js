function saveTopHost() {
  var oneWeekAgo = (new Date).getTime() - MICRO_SECONDS_PER_WEEK;

  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',
      'startTime': oneWeekAgo,
      'maxResults': 1000
    },
    function(historyItems) {
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var processVisitsWithUrl = function(url) {
          return function(visitItems) {
            processVisits(url, visitItems);
          };
        };
        chrome.history.getVisits({
          url: url
        }, processVisitsWithUrl(url));
        numRequestsOutstanding++;
      }
      if (!numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    });

  var urlToCount = {};

  var processVisits = function(url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      host = getHost(url);

      if (!urlToCount[host]) {
        urlToCount[host] = 0;
      }

      urlToCount[host]++;
    }

    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  var onAllVisitsProcessed = function() {
    urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    urlArray.sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    var topHosts = urlArray.slice(0, 20);
    var apps = [];
    for (var i = 0; i < topHosts.length; i++) {
      if (topHosts[i] !== '') {
        var app = new IDLApp();
        app.init(topHosts[i]);
        apps.push(app);
      }
    }
    console.log('TopHosts:', topHosts);
    console.log('apps:', apps);
    saveTopHostsToChrome(apps);
    getList(apps);
  };
}

var getList = function(list) {
  $.ajax({
    url: API_HOST + URI_CATALOGUE,
    data: {
      j: JSON.stringify({
        urlList: list
      })
    },
    dateType: 'json',
    type: 'get'
  }).done(function(data) {
    console.log(data);
    saveTopCategorizedAppsToChrome(data);
  }).fail(function(err) {
    console.error(err);
    saveTopCategorizedAppsToChrome({});
  });
};

// var getCategorizedAppsFromJson = function(json) {
//   for (var category in json) {
//     var apps = json[category];
//   }
// };
var saveTopCategorizedAppsToChrome = function(data) {
  var theValue = data;
  if (!theValue) {
    message('Error: No value specified');
    return;
  }
  DB.saveDB('topCategorizedApps', theValue, function() {
    console.log('save ok');
  });
};

var saveTopHostsToChrome = function(data) {
  var theValue = data;
  console.log('topHosts the Value====>>>', theValue);
  if (!theValue) {
    message('Error: No value specified');
    return;
  }
  DB.saveDB('topHosts', theValue, function() {
    console.log('save ok');
  });
};

var getHost = function(url) {
  var host = "null";
  if (typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /.*\:\/\/([^\/]*).*/;
  var match = url.match(regex);
  if (typeof match != "undefined" && null != match)
    host = match[1];
  return host.replace('www.', '');
}

document.addEventListener('DOMContentLoaded', function() {
  // saveTopHost();
});
