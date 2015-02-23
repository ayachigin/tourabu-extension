'use strict';

module TourabuEx.popup {
    var setting = <HTMLFormElement>document.querySelector('#setting');

    interface Setting {
        setting: {};
    }


    function loadSetting() {
        storage.get('setting').done(function (s) {
            var k, el;
            for (k in (<Object>s)) {
                if (s.hasOwnProperty(k)) {
                    el = <HTMLOptionElement>document.querySelector('#' + k);
                    el.value = s[k];
                }
            }
        });
    }

    loadSetting();

    setting.addEventListener('change',() => {
        var selects = <NodeList>document.querySelectorAll('#notification select'),
            i: number,
            l = selects.length,
            select: HTMLOptionElement,
            s: Setting = { setting: {}};

        for (i = 0; i < l; i++) {
            select = <HTMLOptionElement>selects[i];
            s.setting[select.id] = select.value;
        }

        storage.set(s);
    });

    document.querySelector('#screenshot').addEventListener('click', function () {
        console.log('shot');
        chrome.runtime.sendMessage({ type: 'capture/start' });
    });

    // screen shot hogehoge
    $('#screenshot').hide();

    chrome.runtime.sendMessage({ type: 'popup/show' });

    chrome.runtime.onMessage.addListener(function (mes, sender) {
        if (mes.type === 'content/load') {
            $('#screenshot').show();
        }

        if (mes.type === 'capture/enable') {
            $('#screenshot').show();
        }
    });

    // widget mode
    $('#start-widget').click(function () {
        chrome.runtime.sendMessage({ type: 'start/widget' });
    });
}