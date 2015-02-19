'use strict';

module TourabuEx.widget {
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

    TourabuEx.events.bind('message/start/widget', function () {
        console.log('message/widget/start');
        TourabuEx.util.startTourabuWidget();
    });

    /*
    chrome.tabs.onZoomChange.addListener(function (o) {
        if (widgetTab && widgetTab.id === o.tabId) {
            chrome.tabs.sendMessage(widgetTab.id, {
                type: 'zoom/change',
                scale: o.newZoomFactor
            });
        }
    });
    */
} 