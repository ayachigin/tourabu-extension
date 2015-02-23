/// <reference path="tourabuex.ts" />
'use strict';

module TourabuEx.storage {
    var storageArea = chrome.storage.sync || chrome.storage.local;

    chrome.storage.onChanged.addListener((o, n) => {
        events.trigger('storage/change', o);
    })

    export function get(key: string): JQueryDeferred<any> {
        var d = $.Deferred();
        storageArea.get(key, function (o) {
            if (!TourabuEx.util.isEmpty(o)) {
                d.resolve(o[key]);
            } else {
                d.reject();
            }
        });
        return d;
    }

    export function set(obj, callback?: Function) {
        storageArea.set(obj, callback || function () { });
    }

    export function remove(key: string, callback?: Function) {
        storageArea.remove(key, callback || function () {
            console.log('storage/removed', key);
        });
    }
} 