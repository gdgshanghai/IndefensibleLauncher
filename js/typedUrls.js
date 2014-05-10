function saveTopHost() {
  var oneWeekAgo = (new Date).getTime() - MICRO_SECONDS_PER_WEEK;

  var numRequestsOutstanding = 0;

  chrome.history.search({
    'text': '',
    'startTime': oneWeekAgo,
    'maxResults': 1000
  }, function(historyItems) {
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
    // for (var i = 0; i < topHosts.length; i++) {
    //   var app = new IDLApp();
    //   app.init(topHosts[i]);
    //   apps.push(app);
    // }

    // var collection = new IDLCollection();
    // collection.title = 'TopHosts';
    // collection.apps = apps;
    // collection.save(function() {
    //   console.log('save success', collection);
    // });

    getList(topHosts);
  };
}

var getList = function(list) {
  var c = new IDLCollection();
  c.title = 'TopCategorizedApps';
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
}

var saveTopCategorizedAppsToChrome = function(data) {
  AllCollection.init();
  for (title in data) {
    var col = new IDLCollection(title);
    for (var i = 0, len = data[title].length; i < len; i++) {
      var app = new IDLApp();
      app.init(data[title][i]);
      col.add(app);
    }
    col.save();
  }
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
  saveTopHost();
});
