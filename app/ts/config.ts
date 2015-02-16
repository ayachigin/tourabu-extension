/// <reference path="tourabuex.ts" />
'use strict';

interface Setting {
    'notification-type': string;
    'notification-autohide': string;
}

module TourabuEx.config {
    var setting: Setting;

    TourabuEx.events.bind('storage/change', function (_, o) {
        if (!o.setting) { return; }

        setting = o.setting.newValue;
    });

    TourabuEx.storage.get('setting', function (s) {
        setting = s;
    });

    export function get(k: string) {
        return setting[k];
    }
} 