'use strict';

module TourabuEx.resizeWidget {

    var GAME_WIDTH = 960,
        GAME_HEIGHT = 580,
        WINDOW_FRAME_WIDTH = window.outerWidth - window.innerWidth,
        WINDOW_FRAME_HEIGHT = window.outerHeight - window.innerHeight;


    function widgetProcess() {
        $(document).ready(function () {
            var width = GAME_WIDTH,
                height = GAME_HEIGHT;
            $('#dmm-ntgnavi-renew').hide();
            $(document.body).css({ 'overflow': 'hidden' });
            $('#game_frame').attr('width', '100%').css({ width: '100%' });

            resizeAndScroll(width, height);

            onresized(onResizedHandler);
        });
    }

    function resizeAndScroll(width, height) {
        resize(width, height);
        scroll();
    }

    function scroll() {
        var gameFrame = document.getElementById('game_frame'),
            top = gameFrame.offsetTop,
            left = gameFrame.offsetLeft;

        window.scrollTo(left, top);
    }

    /**
    高さと幅のうち、変化量の大きい方を基準にして縦横比を維持しつつリサイズ
    */
    function onResizedHandler(oldWidth: number, oldHeight: number) {
        var currentWidth = window.outerWidth - WINDOW_FRAME_WIDTH,
            currentHeight = window.outerHeight - WINDOW_FRAME_HEIGHT,
            diffWidth = Math.abs(oldWidth - currentWidth),
            diffHeight = Math.abs(oldHeight - currentHeight),
            newWidth,
            newHeight;

        if (diffWidth > diffHeight) {
            newWidth = currentWidth;
            newHeight = Math.ceil(GAME_HEIGHT * (newWidth / GAME_WIDTH));
        } else {
            newHeight = currentHeight;
            newWidth = Math.ceil(GAME_WIDTH * (newHeight / GAME_HEIGHT));
        }

        chrome.runtime.sendMessage({
            type: 'widget/resized',
            body: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }, function () { });

        return resizeAndScroll(newWidth, newHeight);
    }

    /**
    内側のwidthとheightを基準にしてウィンドウをリサイズする
    */
    function resize(width, height) {
        var outerWidth = WINDOW_FRAME_WIDTH + width,
            outerHeight = WINDOW_FRAME_HEIGHT + height;
        window.resizeTo(outerWidth, outerHeight);
    }

    /**
    リサイズが完了したらファイアーする何か
    生のタイマーイベントは1pxごとに発火して
    */
    function onresized(fn: (width: number, height: number) => void): void {
        var tid, width = null, height = null;
        $(window).resize(function () {
            if (tid) { window.clearTimeout(tid); }
            if (!width) {
                width = window.innerWidth;
                height = window.innerHeight;
            }

            tid = window.setTimeout(function () {
                fn(width, height);
                width = null;
                height = null;
            }, 300);
        });
    }

    chrome.runtime.onMessage.addListener(function (mes, sender, res) {
        if (mes === 'mode/widget') {
            console.log('widget-mode');
            widgetProcess();
            return;
        }
    });
}