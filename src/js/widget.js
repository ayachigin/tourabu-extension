var TourabuEx = TourabuEx || {},
    chrome = chrome || {},
    $ = $ || function () {};

(function () {
    TourabuEx.events.bind('message/content/load', function (_, mes) {
        console.log(mes);
        chrome.windows.get(mes.sender.tab.windowId, function (w) {
            console.log(w);
            if (w.type === 'popup') {
                chrome.tabs.sendMessage(mes.sender.tab.id, 'mode/widget');
            }
        });
    });
}());
