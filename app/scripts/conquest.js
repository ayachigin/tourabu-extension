var TourabuEx = TourabuEx || {};

(function () {
    'use strict';

    var conquestTimeTable = {
        '0': 10000,
        '1':600000,
        '2':1800000,
        '3':1200000,
        '4':3600000,
        '5':5400000,
        '6':10800000,
        '7':7200000,
        '8':9000000,
        '9':14400000,
        '10':10800000,
        '11':36000000,
        '12':28800000,
        '13':7200000,
        '14':18000000,
        '15':43200000,
        '16':21600000,
        '17':43200000,
        '18':64800000,
        '19':54000000,
        '20':86400000
    };

    function simplifyBody (body) {
        return {
            party_no: body.party_no[0],
            field_id: body.field_id[0]
        };
    }

    // 遠征開始通知＆タイマー設定
    TourabuEx.events.bind('conquest/start', function (_, param) {
        // 遠征通知
        console.log('conquest.start', param);
        param.maybe_body.fmap(simplifyBody).fmap(function (body){
            var conquestTime = TourabuEx.util.lookup(conquestTimeTable, body.field_id);
            conquestTime.fmap(function (v) {
                var d = new Date(Date.now() + v),
                    notifyparam = TourabuEx.Notifier.defaultParam(),
                    timer = new TourabuEx.Timer(),
                    timerParam = timer.defaultParam();

                notifyparam.timeout = 5000;
                notifyparam.icon = 'assets/conquest_48.png';
                notifyparam.body  = '第' + body.party_no +
                    '部隊が遠征に出発しました\n' +
                    (parseInt(v / 1000 / 60, 10)) +
                    '分後に帰還します';
                TourabuEx.Notifier(notifyparam);

                timerParam.end = d;
                timerParam.type = 'conquest';
                timerParam.callbackParam = body;
                timer.set(timerParam);
            });

            if (conquestTime.isNothing()) {
                console.log('not in conquest time table', param);
            }
        });
    });

    // 遠征終了通知
    TourabuEx.events.bind('timer/conquest/end', function (_, param) {
        var notificationParams = TourabuEx.Notifier.defaultParam();
        window.console.log('conquest/finished');
        window.console.dir(param);

        notificationParams.body = '部隊' + param.party_no + 'が遠征から帰還しました';
        notificationParams.icon = 'assets/conquest_48.png';
        TourabuEx.Notifier(notificationParams);
    });

    // 遠征キャンセル
    TourabuEx.events.bind('conquest/cancel', function (_, param) {
        var timer = TourabuEx.Timer();
        console.log('conquest/cancel', param);
        param.maybe_body.fmap(function (body) {
            timer.cancel(function (task) {
                console.log('timer/cancel', task);
                return task.callbackParam.party_no === body.party_no[0];
            });
        });
        console.log('conquest/cancel');
    });
}());
