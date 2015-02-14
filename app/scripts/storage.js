var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

TourabuEx.storage = (function () {
    'use strict';
    
    function Storage() {
        this.storageArea = chrome.storage.sync || chrome.storage.local;

        chrome.storage.onChanged.addListener(function (o, a) {
            TourabuEx.events.trigger('storage/change', o, a);
        });
    }

    Storage.prototype = {
        get: function(key, callback) {
            this.storageArea.get(key, function (o) {
                if (!o.isEmpty()) {
                    callback(o[key]);
                } else {
                    console.log('storage/key not found: ' + key);
                }
            });
        },
        set: function (obj, opt_callback) {
            this.storageArea.set(obj, opt_callback || function () {});
        },
        remove: function (key, opt_callback) {
            this.storageArea.remove(key, opt_callback || function () {
                console.log('storege/remove/' + key);
            });
        }
    };

    return new Storage();
}());
