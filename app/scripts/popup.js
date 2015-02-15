/*global chrome, $ */
'use strict';

var TourabuEx = TourabuEx || {};

/*
 Applies the config value read from the local storage in a popup.html at startup.
 Store the config values to local storage when form in the popup.html changed.
 Use config.get in config.js to access config values.
 config.jsはストレージの変更を監視する
 */
(function () {
    var storage = TourabuEx.storage,
        setting = document.querySelector('#setting'),
        DEFAULT_SETTING = function () {
            return {
                'setting': {
                    'notification': {}
                }
            };
        };

    function initialize() {
        storage.get('setting', function (s) {
            // 通知関係
            var notification = s.notification,
                k, i, l, os;

            // 保存されてた設定を反映
            for (k in notification) {
                if (notification.hasOwnProperty(k)) {
                    document.querySelector('#' + k).value = notification[k];
                }
            }

        });
    }

    window.addEventListener('load', initialize);

    setting.addEventListener('change', function (e) {
        var selects = document.querySelectorAll('#notification select'),
            s = DEFAULT_SETTING(),
            i, l = selects.length;

        for (i = 0; i < l; i++) {
            s.setting.notification[selects[i].id] = selects[i].value;
        }

        storage.set(s);
    });

    document.querySelector('#screenshot').addEventListener('click', function () {
        console.log('shot');
        chrome.runtime.sendMessage({type: 'capture/start'});
    });

    // screen shot hogehoge
    $('#screenshot').hide();

    chrome.runtime.sendMessage({type: 'popup/show'});
    
    chrome.runtime.onMessage.addListener(function(mes, sender) {
        if (mes.type === 'content/load') {
            $('#screenshot').show();
        }

        if (mes.type === 'capture/enable') {
            $('#screenshot').show();
        }
    });

    console.log('called/popup');
}());
