/* @flow */

var util = util || {},
    chrome = chrome || {},
    storage;

storage = (function () {
    function Storage() {
        var self = this;
        this.storageArea = chrome.storage.sync || chrome.storage.local;
        this.storage = chrome.storage;
        this.onChanged = function (o, areaName) {
            console.log('storage/change');
            console.dir(o, areaName);
        };
        this.storage.onChanged.addListener(function (o, a) {
            self.onChanged(o, a);
        });
    }

    Storage.prototype = {
        get: function(key, callback) {
            var self = this;
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
