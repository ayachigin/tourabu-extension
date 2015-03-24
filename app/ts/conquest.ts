'use strict';

module TourabuEx.conquest {

    import Maybe = Functools.Maybe;

    interface TimeTable {
        [x: string]: number;
    }

    export interface ConquestRequestBody {
        field_id: string[];
        party_no: string[];
    }

    export interface Param {
        field_id: string;
        party_no: string;
    }

    var CONQUEST_ICON = 'images/conquest_48.png';

    var timetable: TimeTable = {
        '0': 10000,
        '1': 600000,
        '2': 1800000,
        '3': 1200000,
        '4': 3600000,
        '5': 5400000,
        '6': 10800000,
        '7': 7200000,
        '8': 9000000,
        '9': 14400000,
        '10': 10800000,
        '11': 36000000,
        '12': 28800000,
        '13': 7200000,
        '14': 18000000,
        '15': 43200000,
        '16': 21600000,
        '17': 43200000,
        '18': 64800000,
        '19': 54000000,
        '20': 86400000
    };

    export function fieldId2Time(fieldId: string): Maybe<number> {
        return Maybe.pure(timetable[fieldId]);
    }

    function notify(body: string, status: string) {
        var p: TourabuEx.notifier.Param = {
            body: body,
            status: status,
            icon: CONQUEST_ICON
        }
        TourabuEx.notifier.set(p);
    }

    events.bind('conquest/start', (_, rparam) => {
        var rbody: ConquestRequestBody = <ConquestRequestBody>rparam.body,
            conquestTime = timetable[rbody.field_id[0]];
        if (!conquestTime) {
            console.log('not in conquest time table', rparam);
            return;
        }

        var d = new Date(Date.now() + conquestTime),
            cparam: Param = {
                party_no: rbody.party_no[0],
                field_id: rbody.field_id[0]
            },
            task: TourabuEx.timer.TimerTask = {
                end: d,
                type: 'conquest',
                callbackParam: cparam
            }
        TourabuEx.timer.set(task);

        var body = '第' + cparam.party_no +
            '部隊が遠征に出発しました\n' +
            Math.floor(conquestTime / 1000 / 60) +
            '分後に帰還します';
        notify(body, 'start');
    }) 

    TourabuEx.events.bind('timer/conquest/end', (_, cparam) => {
        notify('部隊' + cparam.party_no + 'が遠征から帰還しました', 'end');
    });

    TourabuEx.events.bind('conquest/cancel',(_, rparam: TourabuEx.RequestBody) => {
        var body = rparam.body;
        console.log('timer/cancel', body.party_no[0]);
        TourabuEx.timer.cancel((task) => {
            console.log('cancel', task, body);
            var param = <Param> task.callbackParam;
            return param.party_no === body.party_no[0];
        });
    });
} 