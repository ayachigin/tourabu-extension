var TourabuEx = TourabuEx || {};

(function () {
    'use strict';

    function notify(body, timeout) {
        var notifierParam = TourabuEx.Notifier.defaultParam();

        notifierParam.icon = 'images/duty_48.png';
        notifierParam.body = body;
        notifierParam.timeout = timeout || 0;
        TourabuEx.Notifier(notifierParam);
    }

    TourabuEx.events.bind('duty/start', function (_, o) {
        var timer = TourabuEx.Timer(),
            timerParam = timer.defaultParam();

        // timer
        timerParam.end = new Date(Date.now() + 24 * 60 * 60 * 1000);
        timerParam.type = 'duty';
        timer.set(timerParam);

        // notify
        notify('内番を開始しました', 5000);
        console.log('duty/start', o);
    });

    TourabuEx.events.bind('timer/duty/end', function () {
        notify('内番が終了しました', 5000);
    });

}());
