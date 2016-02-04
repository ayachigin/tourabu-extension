'use strict';

module TourabuEx.repair {

    import zip = Functools.zip;
    import range = Functools.range;

    var SPLIT = 3;

    var repairQueue: { [index: string]: number } = {};

    export interface Param {
        slot_no: number;
    }

    console.log('repair module loaded');

    TourabuEx.events.bind('repair/repair',(_, r) => {
        if (r.body.use_assist[0] === '1') {
            return;
        }

        var slot = parseInt(r.body.slot_no[0], 10);
        repairQueue[r.id] = slot;
        console.log(repairQueue);

    });

    TourabuEx.events.bind('repair/fast',(e, r) => {
        timer.cancel((task) => {
            return task.type === 'repair' && task.callbackParam.slot_no === parseInt(r.body.slot_no[0], 10);
        });
    });

    TourabuEx.events.bind('timer/repair/end',(_, r) => {
        notifier.set({
            body: '手入れ部屋' + r.slot_no + 'の手入れが完了しました。',
            title: '手入れ完了',
            icon: 'images/repair_48.png',
            status: 'end'
        });
    });

    TourabuEx.events.bind('complete/repair/repair',(_, id) => {
        if (!(id in repairQueue)) {
            return;
        }

        var slot = repairQueue[id];
        delete repairQueue[id];

        setTimeout(() => {
            readRepairTime(slot);
        }, 400);
    });

    function readRepairTime(slot) {
        TourabuEx.util.getToukenranbuTab().done((tab) => {
            $.when(TourabuEx.capture.getDimension(tab), TourabuEx.capture.capture(tab))
                .done((dimension: TourabuEx.capture.Dimension, data: string) => {
                if (dimension.width !== 960 ||
                    dimension.height !== 580) {
                    console.error('size error on reading time from image', dimension);
                    return;
                }
                readTimeFromImage(data, slot).done((d) => {
                    console.log('read time done');
                    var cparam: Param = {
                        slot_no: slot
                    },
                        t = d.getTime() - Date.now(),
                        task: timer.TimerTask = {
                            end: d,
                            type: 'repair',
                            callbackParam: cparam
                        };
                    timer.set(task);

                    notifier.set({
                        body: '手入れを開始しました\n' + Math.floor(t / (3600 * 1000)) + '時間' +
                        Math.floor(t / (60 * 1000) % 60) + '分' +
                        Math.floor(t / 1000 % 3600 % 60) + '秒後に通知します',
                        icon: 'images/repair_48.png',
                        status: 'start'
                    });
                });
            });
        });
    }

    interface Point { x: number; y: number }
    interface PointObject { h: Point; m: Point; s: Point }

    function getPosition(slotNumber: number): PointObject {
        var HOUR_X = 580, MIN_X = 631, SEC_X = 683,
            SLOT1_Y = 118, SLOT2_Y = 238, SLOT3_Y = 358, SLOT4_Y = 478,
            ys: number[] = [SLOT1_Y, SLOT2_Y, SLOT3_Y, SLOT4_Y],
            y = ys[slotNumber - 1],
            o = {
                h: { x: HOUR_X, y: y },
                m: { x: MIN_X, y: y },
                s: { x: SEC_X, y: y }
            };

        return o;
    }

    function readTimeFromImage(d: string, slotNumber: number): JQueryPromise<Date> {
        var p = $.Deferred(),
            canvas: HTMLCanvasElement = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            pos = getPosition(slotNumber),
            i = new Image();

        canvas.width = 39 * 3;
        canvas.height = 33;

        i.addEventListener('load',(ev) => {
            var vh, vm, vs, tht, tmt, tst,
                th, tm, ts, vecs;
            ctx.drawImage(i, pos.h.x, pos.h.y, 39, 33, 0, 0, 39, 33);
            ctx.drawImage(i, pos.m.x, pos.m.y, 39, 33, 39, 0, 39, 33);
            ctx.drawImage(i, pos.s.x, pos.s.y, 39, 33, 39*2, 0, 39, 33);

            OCRAD(canvas, {
                numeric: true,
                invert:  true
            }, function (text) {
                    var time, min, sec, msec,
                        result = text.split('').filter(function (c) {
                        return c >= '0' && c <= '9';
                    }).join('');

                    if (result.length !== 6) {
                        return p.reject('Recognition error');
                    } 

                    time = parseInt(result.slice(0, 2), 10);
                    min = parseInt(result.slice(2, 4), 10);
                    sec = parseInt(result.slice(4, 6), 10);
                    msec = Date.now() + (time * 3600 + min * 60 + sec) * 1000;

                    p.resolve(new Date(msec));
            });
        });

        i.src = d;

        return p.promise();
    }
}