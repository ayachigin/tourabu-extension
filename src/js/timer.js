var TourabuEx = TourabuEx || {},
    $ = $ || function () {};

TourabuEx.Timer = (function () {

    function Timer() {
        // new つけ忘れたらつけて返す
        if (!(this instanceof Timer)) {
            return new Timer();
        }

        // しんぐるとん
        if (Timer.instance) { return Timer.instance; }

        Timer.instance = this;
        
        // 通常の初期化処理
        return this.init();
    }

    Timer.prototype.init = function () {
        var events = TourabuEx.events,
            self = this;

        this.timers = [];
        this.seconds = 0;
        this.loadTimers();

        events.bind(events.SECOND_CHANGE, function (e, s) {
            if ((self.seconds++) % 5 === 0) {
                self.checkTimers();
            }
        });

        return this;
    };

    /*
     this.timersの中身が終わってるかチェックする
     終わっている奴があったらタイマー終わったイベントを投げる
     */
    Timer.prototype.checkTimers = function () {
        var now = new Date(),
            i,
            l = this.timers.length,
            types = ['timer'];
        // リストの中身を消しながらループするのでうしろからぺろぺろする
        for (i = l - 1; i >= 0; i--) {
            if (this.timers[i].end < now) {
                this.timers[i].type && types.push(this.timers[i].type);
                types.push('end');
                console.log('types:', types.join('/'));
                TourabuEx.events.trigger(types.join('/'),
                                         this.timers[i].callbackParam);
                this.timers.removeAt(i);
                this.saveTimers();
            }
        }
    };

    // Timer#setするときのデフォルトの引数Object
    Timer.prototype.defaultParam = function () {
        return {
            end: new Date(),
            type: "",
            callbackParam: {}
        };
    };

    Timer.prototype.set = function (param) {
        this.timers.push(param);
        this.saveTimers();
    };

    Timer.prototype.cancel = function (f) {
        console.log('timer/cancel');
        var i, l = this.timers.length;
        for (i = 0; i < l; i++) {
            if(f(this.timers[i])) {
                this.timers.removeAt(i);
                this.saveTimers();
                return this;
            }
        }
        return this;
    };

    Timer.prototype.saveTimers = function () {
        var timersToSave = [], i, l = this.timers.length;
        for (i = 0; i < l; i++) {
            timersToSave[i] = {};
            for (var k in this.timers[i]) if (this.timers[i].hasOwnProperty(k)) {
                timersToSave[i][k] = this.timers[i][k];
            }
            timersToSave[i].end = timersToSave[i].end.toString();
        }
        console.log('timersToSave');
        console.dir(timersToSave);
        TourabuEx.storage.set({'timer_tasks': timersToSave});
    };

    Timer.prototype.loadTimers = function () {
        var self = this;
        TourabuEx.storage.get('timer_tasks', function (timerTasks) {
            var i, l = timerTasks.length, d;
            console.log(timerTasks);
            for (i = 0; i < l; i++) {
                d = new Date(timerTasks[i].end);
                if ( d.isValid() ) {
                    timerTasks[i].end = d;
                    self.timers.push(timerTasks[i]);
                }
            }
        });
    };

    new Timer();
    
    return Timer;
}());
