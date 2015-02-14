var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

TourabuEx.Dispatcher = (function () {
    'use strict';
    var util = TourabuEx.util;

    // いろんなイベントが起きたら TourabuEx.events.trigger を叩くやつ
    function Dispatcher() {

        if (!(this instanceof Dispatcher)) {
            return new Dispatcher();
        }

        if (Dispatcher.instance) {
            return Dispatcher.instance;
        }

        Dispatcher.instance = this;

        startListeningRequest();
        startTimer();
        startListeningMessage();
        return this;
    }

    function startListeningMessage() {
        chrome.runtime.onMessage.addListener(function (message,
                                                       sender,
                                                       sendResponse) {
            if (!message.type) { return; }

            TourabuEx.events.trigger('message/' + message.type, {
                message:      message.body,
                sender:       sender,
                sendResponse: sendResponse
            });
        });
    }
    
    function startListeningRequest() {
        chrome.webRequest.onBeforeRequest.addListener(
            onBeforeRequest,
            {urls: ['*://*.touken-ranbu.jp/*']},
            ['requestBody']);
    }


    function startTimer() {
        window.setInterval(function () {
            TourabuEx.events.trigger(TourabuEx.events.SECOND_CHANGE,
                           parseInt(Date.now() / 1000, 10));
        }, 1000);
    }

    function onBeforeRequest(d) {
        if (d.method === 'GET') { return; }
        
        // http://w003.touken-ranbu.jp/mission/index てurlの mission/index の部分
        var keyword = d.url.split('/').slice(3).join('/'),
            param = {
                method: d.method,
                maybe_body: util.maybe(d.requestBody.formData),
                url: d.url
            };
        TourabuEx.events.trigger(keyword, param);
    }

    return Dispatcher;
}());
