'use strict';

module TourabuEx.content {
    chrome.runtime.sendMessage({
        type: 'content/load',
        body: {}
    });

    chrome.runtime.onMessage.addListener((mes, sender, callback) => {
        if (mes.type === 'capture/start') {
            callback(getDimension());
        }
    });

    function getDimension(): TourabuEx.capture.Dimension {
        var gameFrame = $('#game_frame'),
            offset = gameFrame.offset(),
            got = offset.top,
            gol = offset.left,
            gw = gameFrame[0].offsetWidth,
            wsy = (<any>window).scrollY,
            wsx = (<any>window).scrollX,
            wiw = window.innerWidth,
            wih = window.innerHeight;
        return {
            y: got - wsy,
            x: gol - wsx,
            width: Math.min(gw, wiw),
            height: Math.min(Math.floor(580 * (gw / 960)), wih)
        };
    }
} 