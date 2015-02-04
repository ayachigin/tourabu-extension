var TourabuEx = TourabuEx || {},
    log = [],
    Dispatcher = Dispatcher || function () {},
    chrome = chrome || {};

function showLog() {
    console.log(JSON.stringify(log));
}

// test timers
var t = new TourabuEx.Timer();
TourabuEx.events.bind('timer.end.test', function (e, p) {
    console.log(p.hoge);
});

//t.set({end: new Date(Date.now() + 10000), callbackParam: {hoge: "time is out!"}});

var d = new TourabuEx.Dispatcher();
/*
(function () {
    'usestrict';

    console.log("ToukenRanbuExt");

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
*/
