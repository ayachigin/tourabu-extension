/* @flow */
var log = [],
    Dispatcher = Dispatcher || function () {},
    chrome = chrome || {};

function showLog() {
  console.log(JSON.stringify(log));
}

(function () {
  'usestrict';

  console.log("ToukenRanbuExt");

  function infixOf(a, b) {
    return b.indexOf(a) !== -1;
  }

  function onBeforeRequest (details) {
    var d = new Dispatcher(details);
    d.go();
    if ( d.isPost() ) {
      console.dir(d.url);
      log.push({
          url: d.url,
          data: d.body
      });
    }
  }

  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequest,
    {urls: ["*://*.touken-ranbu.jp/*"]},
    ['requestBody']);
}());