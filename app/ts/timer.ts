'use strict';

module TourabuEx.timer {
    export interface TimerTask {
        end: Date;
        type: string;
        callbackParam: any;
    }

    interface TimerTaskToSave {
        end: string;
        type: string;
        callbackParam: any;
    }

    var timers: TimerTask[] = [];
    var seconds: number = 0;

    export function set(p: TimerTask) {
        timers.push(p);
        saveTimers();
    }

    export function cancel(f: (t: TimerTask) => boolean) {
        timers.forEach((t, i, ts) => {
            if (f(t)) {
                TourabuEx.util.removeAt(ts, i);
                saveTimers();
                return;
            }
        });
    }

    function saveTimers() {
        var timersToSave: TimerTaskToSave[];

        timersToSave = timers.map((task) => {
            return {
                end: task.end.toString(),
                type: task.type,
                callbackParam: task.callbackParam
            }
        });

        console.log('timers/save', timersToSave);
        TourabuEx.storage.set({ 'timer_tasks': timersToSave });
    }

    function loadTimers() {
        TourabuEx.storage.get('timer_tasks', function (tasks: TimerTaskToSave[]) {
            tasks.forEach((task) => {
                var d = new Date(task.end);
                if (TourabuEx.util.isValid(d)) {
                    timers.push({
                        end: d,
                        type: task.type,
                        callbackParam: task.callbackParam
                    });
                }
            });
        })
    }

    function checkTimers() {
        var now = new Date(),
            anyTimersFinished = false;
        timers = timers.filter((task) => {
            var ended = task.end < now;
            if (ended) {
                TourabuEx.events.trigger('timer/' + task.type + '/end', task.callbackParam);
                anyTimersFinished = true;
                return false;
            } else {
                return true;
            }
        });
        if (anyTimersFinished) {
            saveTimers();
        }
    }

    function initialize() {
        var events = TourabuEx.events;

        timers  = [];
        seconds = 0;

        loadTimers();

        events.bind('second/change', function () {
            if ((seconds++) % 5 === 0) {
                checkTimers();
            }
        });
    }

    initialize();
} 