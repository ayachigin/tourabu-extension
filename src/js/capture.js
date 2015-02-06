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
        var d1 = $.Deferred(),
            d2 = $.Deferred();

        chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataurl) {
            console.log('resolve/dataurl', dataurl);
            d1.resolve(dataurl);
        });

        chrome.tabs.sendMessage(tab.id, {type: 'capture/start'},
                                function (dimension) {
            console.log('resolve/dimension', dimension);
            d2.resolve(dimension);
        });

        $.when(d1, d2).done(function (dataurl, dimension) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = document.createElement('img'),
                trimemdDataurl;

            img.src = dataurl;
            img.onload = function () {
                var d = new Date(),
                    ds = d.toLocaleString().replace(/[\/:]/g, '-').replace(/\s/, '.'),
                    filename = 'とうらぶスクショ/' + ds + '.png';
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
                trimemdDataurl = canvas.toDataURL("image/png");

                chrome.downloads.download({url: trimemdDataurl,
                                           filename: filename});
            };
        });
    });
}());
