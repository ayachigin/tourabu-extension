'use strict';

module TourabuEx.resizeWidget {

    var GAME_WIDTH = 960,
        GAME_HEIGHT = 580;

    function widgetProcess() {
        $(document).ready(function () {
            var width = GAME_WIDTH,
                height = GAME_HEIGHT;

            $(document.body).css({ 'overflow': 'hidden' });
            resizeAndScroll(width, height);
            onresized(function () { });
        });
    }

    function resizeAndScroll(width, height) {
        console.log(width, height);
        resize(width, height);
        scroll();
    }

    function scroll() {
        var gameFrame = document.querySelector('#game_frame'),
            top = (<any>gameFrame).offsetTop,
            left = (<any>gameFrame).offsetLeft;

        window.scrollTo(left, top);
    }

    function resize(width, height) {
        var outerWidth = window.outerWidth - window.innerWidth + width,
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
            return;
        }

        if (mes.type === 'zoom/change') {
            console.log('zoom', mes);
            var width = Math.floor(GAME_WIDTH * mes.scale),
                height = Math.floor(GAME_HEIGHT * mes.scale);
            resizeAndScroll(GAME_WIDTH, GAME_HEIGHT);
        }
    });

}