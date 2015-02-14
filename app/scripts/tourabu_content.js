console.log('content/document/idle');

var chrome = chrome || {};

(function () {
    'use strict';
    
    var message = {type: 'content/load', body: {}};
    chrome.runtime.sendMessage(message);
    console.log('message/sent');
    chrome.runtime.onMessage.addListener(function (mes, sender, sendResponse) {
        if (mes.type === 'capture/start') {
            sendResponse(getDimension());
        }
    });

    function getDimension () {
        var gameFrame = document.querySelector('#game_frame'),
            got = gameFrame.offsetTop,
            gol = gameFrame.offsetLeft,
            gw  = gameFrame.offsetWidth,
            wsy = window.scrollY,
            wsx = window.scrollX,
            wiw = window.innerWidth,
            wih = window.innerHeight;
        return {
            sy: got - wsy,
            sx: gol - wsx,
            width: Math.min(gw, wiw),
            height: Math.min(parseInt(580 * (gw / 960), 10), wih)
        };
    }
}());
