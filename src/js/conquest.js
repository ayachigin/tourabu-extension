/* @flow */
var timer = timer || {};

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
  timer.conquest = function (param) {
    window.console.log('timer/conquest');
    util.lookup(conquestTimeTable, param.field_id).fmap(function (v) {
      var end = new Date(Date.now() + v);
      param.date = end;
      param.callback = function(p) {
        var n, notificationParams = window.notifier.defaultParams();
        window.console.log('conquest/finished');
        window.console.dir(p);

        notificationParams.body = "部隊" + p.party_no
                                + "が遠征から帰還しました";
        notificationParams.icon = "assets/conquest_48.png";
        n = notifier.set(notificationParams);
      };
      timer.set(param);
    });
    return this;
  };
}());
