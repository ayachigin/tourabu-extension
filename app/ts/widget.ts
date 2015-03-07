'use strict';

module TourabuEx.widget {
    var widgetTab = null;

    TourabuEx.events.bind('message/content/load', function (_, mes) {
        widgetMessage(mes, 'mode/widget');
    });

    TourabuEx.events.bind('message/game_frame/load', function (_, mes) {
        widgetMessage(mes, 'mode/widget/frame');
    });

    function widgetMessage(mes: TourabuEx.ReceivedMessage, s: string) {
        chrome.windows.get(mes.sender.tab.windowId, function (w) {
            console.log(w);
            if (w.type === 'popup') {
                widgetTab = mes.sender.tab;
                chrome.tabs.sendMessage(mes.sender.tab.id, s);
            }
        });
    }

    TourabuEx.events.bind('message/widget/resized', function (_, mes) {
        chrome.tabs.sendMessage(widgetTab.id, {
            type: 'resize/flash_object',
            width: mes.message.width,
            height: mes.message.height
        });
    });

    TourabuEx.events.bind('message/start/widget', function () {
        console.log('message/widget/start');
        TourabuEx.util.focusOrStartTourabuWidget();
    });
} 