/// <reference path="tourabuex.ts" />
'use strict';

module TourabuEx.storage {
    var storageArea = chrome.storage.sync || chrome.storage.local;

    export function get(key: string, callback: Function) {
        storageArea.get(key, function (o) {
            if (!TourabuEx.util.isEmpty(o)) {
                callback(o[key]);
            } else {
                console.log('storage/key not forund: ' + key);
            }
        });
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