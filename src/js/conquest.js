/* @flow */
var timer = timer || {},
    notifier = notifier || {};

(function () {
    'usestrict';

    var conquestTimeTable = {
        '0': 1000,
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

    /* 遠征タイマー設定
     */
    timer.conquest = function (params) {
        window.console.log('timer/conquest');

        // 遠征通知
        util.lookup(conquestTimeTable, params.field_id).fmap(function (v) {
            var d = new Date(Date.now() + v),
                notifyParams = notifier.defaultParams();
            notifyParams.timeout = 8000;

            notifyParams.body  = "第" + params.party_no + "部隊が遠征に出発しました\n"
                + (parseInt(v / 1000 / 60, 10))
                + "分後に帰還します";
            notifier.set(notifyParams);

            params.date = d;
            timer.set(params);
        });
        return this;
    };

    timer.conquest.finished = function(params) {
        var notificationParams = notifier.defaultParams();
        window.console.log('conquest/finished');
        window.console.dir(params);

        notificationParams.body = "部隊" + params.party_no
            + "が遠征から帰還しました";
        notificationParams.icon = "assets/conquest_48.png";
        notifier.set(notificationParams);
    };

}());
