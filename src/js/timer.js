/* @flow */

/*
 timer.set("tid", "2015/1/29 0:48:00", "fuga",
 "Quest", {party: 2}, function (a) {console.log(a);});
 timer.set("tid", "2015/1/29 0:48:00", "hoge",
 "Quest", {party: 3}, function (a) {console.log(a);});
 timer.cancel("Quest", function (i) {
 return i.party === 3;
 });
 */

var timer = timer || {};

(function () {
    var INTERVAL = 1000,
        timers = [];

    function Timer() {
    }

    Timer.prototype.set = function (param) {
        timers.push(param);
        console.log('timer/set');
        console.dir(timers);
    };


    // cancel :: (param -> bool) -> ()
    Timer.prototype.cancel = function (f) {
        console.log('timer/cancel');
        var i, l = timers.length;
        for (i = 0; i < l; i++) {
            if(f(timers[i])) {
                timers.splice(i, 1);
                return this;
            }
        }
        console.log('Non-existed timer');
        return this;
    };

    timer = new Timer();

    function tick() {
        var now = new Date(),
            i,
            l = timers.length;
        for (i = 0; i < l; i++) {
            if (timers[i].date < now) {
                timers[i].callback(timers[i]);
                timers.splice(i, 1);
                break;
            }
        }
        setTimeout(tick, INTERVAL);
    }

    tick();

}());
