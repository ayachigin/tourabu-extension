var TourabuEx = TourabuEx || {},
    chrome = chrome || {},
    $ = $ || function () {};

(function () {
    var tourabuWinId, tourabuTabId;
    
    TourabuEx.events.bind('message/content/load', function (e, mes) {
        console.log('message/content/load');
        chrome.pageAction.show(mes.sender.tab.id);
    });

    chrome.pageAction.onClicked.addListener(function (tab) {
        chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataurl) {
            getDimension(tab).done(function (dimension) {
                downloadImage(trimImage(dataurl, dimension));
            });
        });
        /*
        var image = capture(tab),
            dim   = getDimension(tab);
        $.when(image, dim).done(function (dataurl, dimension) {
            downloadImage(dimension, dataurl);
            dataurl = dimension = image = dim = null;
        });
         */
    });

    function downloadImage(dataurl) {
        var d = new Date(),
            ds = d.toLocaleString().replace(/[\/:]/g, '-').replace(/\s/, '.'),
            filename = 'とうらぶスクショ/' + ds + '.png';

        chrome.downloads.download({url: dataurl,
                                   filename: filename});
    }

    function capture(tab) {
        var dfd = $.Deferred();
        chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataurl) {
            dfd.resolve(dataurl);
        });
        return dfd;
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

        return canvas.toDataURL("image/png");
    }
}());
