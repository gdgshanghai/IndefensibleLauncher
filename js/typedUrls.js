// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function saveTopHost() {
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '', // Return every history item....
      'startTime': oneWeekAgo // that was accessed less than one week ago.
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
    console.log(topHosts[0]);
  };
}

var getHost = function(url) {
  var host = "null";
  if (typeof url == "undefined" || null == url)
    url = window.location.href;
  var regex = /.*\:\/\/([^\/]*).*/;
  var match = url.match(regex);
  if (typeof match != "undefined" && null != match)
    host = match[1];
  return host;
}

document.addEventListener('DOMContentLoaded', function() {
  saveTopHost();
});
