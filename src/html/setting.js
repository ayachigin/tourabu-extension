/*
 起動時にローカルストレージから読み取った値をポップアップウィンドウに反映する。
 変更時にローカルストレージに値をぶっ込む。
 */
var storage = storage || {};

(function () {
    var setting = document.querySelector('#setting');

    window.addEventListener('load', onload);

    function onload () {
        storage.get('setting', function (s) {
            // 通知関係
            var notification = s.notification,
                k, i, l, os;

            // 保存されてた設定を反映
            for (k in notification) if (notification.hasOwnProperty(k)) {
                document.querySelector('#' + k).value = notification[k];
            }

        });
    }

    setting.addEventListener('change', function (e) {
        console.dir(storage);

        var selects = document.querySelectorAll('#notification select'),
            s = {
                'setting': {
                    'notification': {}
                }
            },
            i, l = selects.length;

        for (i = 0; i < l; i++) {
            s.setting.notification[selects[i].id] = selects[i].value;
        }

        storage.set(s);
    });
}());
