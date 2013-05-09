// Generated by CoffeeScript 1.5.0
(function() {
  var fetch, request, root, wikigeo, _browserFetch, _fetch, _search,
    _this = this;

  wikigeo = function(latlon, opts, callback) {
    if (!opts.limit) {
      opts.limit = 10;
    }
    if (!opts.radius) {
      opts.radius = 10000;
    }
    return _search(latlon[0], latlon[1], opts.radius, opts.limit, callback);
  };

  _search = function(lat, lon, radius, limit, callback, results, queryContinue) {
    var continueParams, name, param, q, url;
    url = "http://en.wikipedia.org/w/api.php";
    q = {
      action: "query",
      prop: "info|extracts|coordinates|pageprops",
      exlimit: "max",
      exintro: 1,
      explaintext: 1,
      generator: "geosearch",
      ggsradius: radius,
      ggscoord: "" + lat + "|" + lon,
      ggslimit: limit,
      format: "json"
    };
    continueParams = {
      extracts: "excontinue",
      coordinates: "cocontinue"
    };
    if (queryContinue) {
      for (name in continueParams) {
        param = continueParams[name];
        if (queryContinue[name]) {
          q[param] = queryContinue[name][param];
        }
      }
    }
    return fetch(url, {
      params: q
    }, function(response) {
      var article, articleId, newValues, prop, resultsArticle, _ref;
      if (!results) {
        results = response;
      }
      _ref = response.query.pages;
      for (articleId in _ref) {
        article = _ref[articleId];
        resultsArticle = results.query.pages[articleId];
        for (prop in continueParams) {
          if (prop === 'extracts') {
            prop = 'extract';
          }
          newValues = article[prop];
          if (!newValues) {
            continue;
          }
          if (Array.isArray(newValues)) {
            if (!resultsArticle[prop]) {
              resultsArticle[prop] = [];
            }
            resultsArticle[prop] = resultsArticle[prop].concat(newValues);
          } else {
            resultsArticle[prop] = article[prop];
          }
        }
      }
      if (response['query-continue']) {
        if (!queryContinue) {
          queryContinue = response['query-continue'];
        } else {
          for (name in continueParams) {
            param = continueParams[name];
            if (response['query-continue'][name]) {
              queryContinue[name] = response['query-continue'][name];
            }
          }
        }
        return _search(lat, lon, radius, limit, callback, results, queryContinue);
      } else {
        return callback(results);
      }
    });
  };

  _fetch = function(uri, opts, callback) {
    return request(uri, {
      qs: opts.params,
      json: true
    }, function(e, r, data) {
      return callback(data);
    });
  };

  _browserFetch = function(uri, opts, callback) {
    return $.ajax({
      url: url,
      data: opts.params,
      dataType: "jsonp",
      success: callback
    });
  };

  try {
    request = require('request');
    fetch = _fetch;
  } catch (error) {
    fetch = _browserFetch;
  }

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.wikigeo = wikigeo;

}).call(this);