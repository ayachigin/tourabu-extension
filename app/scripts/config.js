var TourabuEx = TourabuEx || {};

TourabuEx.config = (function () {
    'use strict';
    var config = {},
        setting = {};

    TourabuEx.events.bind('storage/change', function(_, o) {
        if (!o.setting) { return; }

        setting = o.setting.newValue;
    });

    TourabuEx.storage.get('setting', function(s) {
        setting = s;
    });
    
    config.get = function (k) {
        return setting[k];
    };

    return config;
}());
