'use strict';

module TourabuEx.duty {
    var DUTY_ICON = 'images/duty_48.png';

    function notify(body, status) {
        var p: notifier.Param;

        p = {
            body: body,
            icon: DUTY_ICON,
            status: status,
        }

        notifier.set(p);
    }

    events.bind('duty/start', () => {
        var task: timer.TimerTask;

        task = {
            end: new Date(Date.now() + 24 * 60 * 60 * 1000),
            type: 'duty',
            callbackParam: {}
        }

        timer.set(task);
        notify('内番を開始しました', 'start');
    });

    events.bind('timer/duty/end',() => {
        notify('内番が終了しました', 'end');
    });
} 