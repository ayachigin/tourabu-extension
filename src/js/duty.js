var TourabuEx = TourabuEx || {};

(function () {
    'usestrict';

    TourabuEx.events.bind('duty/start', function (_, o) {
        var timer = TourabuEx.Timer(),
            timerParam = timer.defaultParam();

        timerParam.end = new Date(Date.now() + 24 * 60 * 60 * 1000);
        timerParam.type = 'duty';
        timer.set(timerParam);
        console.log('duty/start', o);
    });

    TourabuEx.events.bind('timer/duty/end', function () {
        var notifierParam = TourabuEx.Notifier.defaultParam();

        notifierParam.icon = 'assets/duty_48.png';
        notifierParam.body = '内番が終了しました';
        TourabuEx.Notifier(notifierParam);
    });

}());
