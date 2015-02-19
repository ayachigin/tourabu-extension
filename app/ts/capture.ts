'use strict';
 
module TourabuEx.capture {

    interface Dimension {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    events.bind('message/content/load',(_, r) => {
        console.log('message/content/load');
    });

    events.bind('message/popup/show',() => {
        console.log('popup/show');
        TourabuEx.util.getToukenranbuTab().done(() => {
            chrome.runtime.sendMessage({ type: 'capture/enable' });
        })
    });

    function capture(tab: chrome.tabs.Tab) {
        chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' },(dataUrl) => {
            getDimension(tab).done((dimension) => {
                downloadImage(trimImage(dataUrl, dimension))
            }).fail(() => {
                downloadImage(dataUrl);
            });

        });
    }

    function getDimension(tab: chrome.tabs.Tab): JQueryDeferred<Dimension> {
        var dfd = $.Deferred();
        chrome.tabs.sendMessage(tab.id, { type: 'capture/start' },(dimension: Dimension) => {
            dfd.resolve(dimension);
        })
        setTimeout(() => dfd.reject(), 1000);
        return dfd;
    };

    function downloadImage(dataUrl: string): void {
        var d = new Date(),
            ds = d.toLocaleString().replace(/[\/:]/g, '-').replace(/\s/, '.'),
            filename = 'とうらぶスクショ/' + ds + '.png';

        chrome.downloads.download({
            url: dataUrl,
            filename: filename
        });
    }

    function trimImage(dataurl: string, dimension: Dimension): string {
        var img = document.createElement('img'),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        img.src = dataurl;
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        ctx.drawImage(img,
            dimension.x,
            dimension.y,
            dimension.width,
            dimension.height,
            0, 0,
            dimension.width,
            dimension.height);
        img = img.src = ctx = null;

        return canvas.toDataURL('image/png');
    }
}
