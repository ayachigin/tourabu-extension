'use strict';
 
module TourabuEx.capture {

    export interface Dimension {
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

    events.bind('message/capture/start',() => {
        TourabuEx.util.getToukenranbuTab().done((tab) => {
            capture(tab).done(downloadImage);
        });
    });

    export function capture(tab: chrome.tabs.Tab): JQueryPromise<string> {
        var d = $.Deferred();
        chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' },(dataUrl) => {
            getDimension(tab).done((dimension) => {
                console.dir(dimension);
                trimImage(dataUrl, dimension).then(d.resolve);
            }).fail(() => {
                d.resolve(dataUrl);
            });
        });
        return d.promise();
    }

    function getDimension(tab: chrome.tabs.Tab): JQueryDeferred<Dimension> {
        var dfd = $.Deferred();
        chrome.tabs.sendMessage(tab.id, { type: 'capture/start' },(dimension: Dimension) => {
            if (dimension) {
                dfd.resolve(dimension);
            } else {
                dfd.reject();
            }
        })
        setTimeout(() => dfd.reject(), 1000);
        return dfd;
    }

    export function downloadImage(dataUrl: string): void {
        var d = new Date(),
            ds = d.toLocaleString().replace(/[\/:]/g, '-').replace(/\s/, '.'),
            filename = 'とうらぶスクショ/' + ds + '.png';

        chrome.downloads.download({
            url: dataUrl,
            filename: filename
        });
    }

    function trimImage(dataurl: string, dimension: Dimension):JQueryDeferred<string> {
        var d = $.Deferred(),
            img = new Image(),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        canvas.width = dimension.width;
        canvas.height = dimension.height;
        // context . drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
        img.addEventListener('load',(e) => { 
            ctx.drawImage(img,
                dimension.x,
                dimension.y,
                dimension.width,
                dimension.height,
                0, 0,
                dimension.width,
                dimension.height);
            d.resolve(canvas.toDataURL('image/png'));
        });
        img.src = dataurl;
        return d;
    }
}
