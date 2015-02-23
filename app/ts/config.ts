/// <reference path="tourabuex.ts" />
'use strict';

module TourabuEx.config {
    export interface Setting {
        'notification-type': string;
        'notification-autohide': string;
        'notification-sound': string;
    }

    export var DefaultSetting: Setting = {
        'notification-type': 'start-end',
        'notification-autohide': 'start',
        'notification-sound': 'end'
    }

    var setting: Setting;



    TourabuEx.events.bind('storage/change', (_, o: any) => {
        if (!o.setting) { return; }

        setting = o.setting.newValue;
    });

    TourabuEx.storage.get('setting').done(function (s: Setting) {
        setting = s;
    }).fail(function () {
        setting = DefaultSetting;
        storage.set({ 'setting': setting });
    });

    export function get(k: string) {
        return setting[k];
    }
} 