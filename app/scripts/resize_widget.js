var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

(function () {
    'use strict';
    
    var GAME_WIDTH = 960,
        GAME_HEIGHT = 580;
    
    function widgetProcess () {
        $(document).ready(function () {
            var gameFrame = document.querySelector('#game_frame'),
                top = gameFrame.offsetTop,
                left = gameFrame.offsetLeft,
                width = GAME_WIDTH,
                height = GAME_HEIGHT;

            $(document.body).css({'overflow': 'hidden'});
            resizeAndScroll(left, top, width, height);
            onresized(function () {});
        });
    }

    function resizeAndScroll(left, top, width, height) {
        resize(width, height);
        scroll(left, top);
    }

    function scroll(left, top) {
        window.scrollTo(left, top);
    }

    function resize(height, width) {
        var outerWidth  = window.outerWidth - window.innerWidth + width,
            outerHeight = window.outerHeight - window.innerHeight + height;

        window.resizeTo(outerWidth, outerHeight);
    }

    function onresized(fn) {
        var tid;
        $(window).resize(function () {
            if (tid) { window.clearTimeout(tid); }

            tid = window.setTimeout(fn, 200);
        });
    }

    chrome.runtime.onMessage.addListener(function (mes, sender, res) {
        if (mes === 'mode/widget') {
            console.log('widget-mode');
            widgetProcess();
        }
    });
}());
