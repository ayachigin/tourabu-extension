var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

(function () {
    'use strict';
    var widgetTab = null;

    TourabuEx.events.bind('message/content/load', function (_, mes) {
        console.log(mes);
        chrome.windows.get(mes.sender.tab.windowId, function (w) {
            console.log(w);
            if (w.type === 'popup') {
                widgetTab = mes.sender.tab;
                chrome.tabs.sendMessage(mes.sender.tab.id, 'mode/widget');
            }
        });
    });

    chrome.tabs.onZoomChange.addListener(function (o) {
        if (widgetTab && widgetTab.id === o.tabId) {
            chrome.tabs.sendMessage(widgetTab.id, {type: 'zoom/change',
                                                   scale: o.newZoomFactor});
        }
    });
}());
