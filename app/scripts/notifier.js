var TourabuEx = TourabuEx || {};

TourabuEx.Notifier = function (params) {
    'use strict';
    var ntype = TourabuEx.config.get('notification-type'),
        autohide = TourabuEx.config.get('notification-autohide');

    if (ntype && ! params.status.isInfixOf(ntype)) { return; }

    if (autohide && params.status.isInfixOf(autohide)) {
        params.timeout = 5000;
    } else {
        params.timeout = 0;
    }

    var n = new window.Notification(params.title,
                                    {
                                        icon: params.icon,
                                        body: params.body
                                    });
    n.onclick = params.onClicked;
    n.onclose = params.onClosed;
    n.onshow  = function () {
        var self = this;
        // タイムアウトがゼロなら表示しっぱなし
        if (params.timeout === 0) { return; }
        // タイムアウトが設定されてたならnミリ秒後に消す
        else {
            setTimeout(function () {
                self.close();
            }, params.timeout);
            return;
        }
    };
    n.onerror = params.onError;
    n.timeout = params.timeout;
    console.log('nitifier', n);
    return n;
};

TourabuEx.Notifier.defaultParam = function () {
    'use strict';

    return {
        status: '',
        icon: 'images/icon_touken_128.png',
        title: 'とうらぶえくすてんしょん',
        body: '',
        timeout: 0,
        onClicked: function () {
            console.log('notification/clicked');
            TourabuEx.util.focusOrStartTourabu();
        },
        onError:   function () { console.log('notification/error'); }
    };
};
