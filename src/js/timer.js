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

var storage = storage || {},
    timers = [],
    timer = (function () {
        var INTERVAL = 5000;

        function Timer() {
            this.loadTimers().done(function (ts) {
                timers = timers.concat(ts);
                console.log('timer/loaded');
                console.dir(timers);
            });
            this.start();
        }

        Timer.prototype.set = function (param) {
            var self = this;
            timers.push(param);
            console.log('timer/set');
            console.dir(param);
            this.saveTimers();
        };

        Timer.prototype.saveTimers = function () {
            var timersToSave = [], i, l = timers.length;
            for (i = 0; i < l; i++) {
                timersToSave[i] = {};
                for (var k in timers[i]) if (timers[i].hasOwnProperty(k)) {
                    timersToSave[i][k] = timers[i][k];
                }
                timersToSave[i].date = timersToSave[i].date.toString();
            }
            console.log('timersToSave');
            console.dir(timersToSave);
            storage.set({'timer_tasks': timersToSave});
        };

        Timer.prototype.loadTimers = function () {
            var d = $.Deferred();
            storage.get('timer_tasks', function (timerTasks) {
                var i, l = timerTasks.length;
                for (i = 0; i < l; i++) {
                    timerTasks[i].date = new Date(timerTasks[i].date);
                }
                d.resolve(timerTasks);
            });
            return d;
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
            this.saveTimers();
            console.log('Non-existed timer');
            return this;
        };

        Timer.prototype.start = function () {
            var self = this;
            window.setInterval(function () {
                self.tick();
            }, INTERVAL);
        };

        Timer.prototype.finished = function (timerTask) {
            switch (timerTask.type) {
            case 'conquest':
                this.conquest.finished(timerTask);
                break;
            default:
                //pass
                break;
            }
        };

        Timer.prototype.tick = function() {
            var now = new Date(),
                i,
                l = timers.length;
            for (i = 0; i < l; i++) {
                if (timers[i].date < now) {
                    this.finished(timers[i]);
                    timers.splice(i, 1);
                    this.saveTimers();
                    return this.tick();
                }
            }
        };

        return new Timer();
    }());
