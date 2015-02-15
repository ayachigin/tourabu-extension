var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

(function () {
    'use strict';
    var targetTab = null;

    TourabuEx.events.bind('message/content/load', function (e, mes) {
        console.log('message/content/load');
        targetTab = mes.sender.tab;
    });

    TourabuEx.events.bind('message/popup/show', function (e, mes) {
        console.log('popup/show');
        TourabuEx.util.getToukenRanbuTab().done(function () {
            chrome.runtime.sendMessage({type: 'capture/enable'});
        });
    });

    function capture(tab) {
        console.log(tab);
        chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataurl) {
            getDimension(tab).done(function (dimension) {
                if (dimension) {
                    downloadImage(trimImage(dataurl, dimension));
                } else {
                    downloadImage(dataurl);
                }
            });
        });
    }

    TourabuEx.events.bind('message/capture/start', function () {
        TourabuEx.util.getToukenRanbuTab().done(function(tab) {
            capture(tab);
        });
    });

    function downloadImage(dataurl) {
        var d = new Date(),
            ds = d.toLocaleString().replace(/[\/:]/g, '-').replace(/\s/, '.'),
            filename = 'とうらぶスクショ/' + ds + '.png';

        chrome.downloads.download({url: dataurl,
                                   filename: filename});
    }

    function getDimension(tab) {
        var dfd = $.Deferred();
        chrome.tabs.sendMessage(tab.id, {type: 'capture/start'},
                                function (dimension) {
                                    dfd.resolve(dimension);
                                });
        return dfd;
    }

    function trimImage(dataurl, dimension) {
        var img = document.createElement('img'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        img.src = dataurl;
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        ctx.drawImage(img,
                      dimension.sx,
                      dimension.sy,
                      dimension.width,
                      dimension.height,
                      0, 0,
                      dimension.width,
                      dimension.height);
        img = img.stc = ctx = null;

        return canvas.toDataURL('image/png');
    }
}());
