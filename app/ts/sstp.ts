/// <reference path="tourabuex.ts" />
'use strict';

module TourabuEx.SSTP {
    var HOST = '127.0.0.1:';

    class Client {
        private connection: WebSocket;

        constructor(port?: number) {
            port = port || 55432;
            this.connection = new WebSocket('ws://' + HOST + port + '/notify');
        }

        send(message: string, callback?: (ev: MessageEvent) => any) {
            this.connection.onmessage = callback || function (m) { console.log(m); };

            if (this.connection.readyState === 0) {
                this.connection.onopen = () => {
                    this.connection.send(message);
                }
            } else if (this.connection.readyState === 1) {
                this.connection.send(message);
            }
        }
    }

    TourabuEx.events.bind('conquest/start',(_, r) => {
        var body = <TourabuEx.conquest.ConquestRequestBody> r.body,
            party = body.party_no[0];

        Functools.Maybe.pure(body.field_id[0])
            .bind(function (fid) {
            return TourabuEx.conquest.fieldId2Time(fid);
        })
            .bind(function (n) {
            var c = new Client(),
                min = Math.floor(n / 1000 / 60);

            c.send('OnTourabuConquestStart,とうらぶえくすてんしょん,\\0第' + party +
                '部隊が遠征を開始しました。\\n' + min +
                '分後に帰還します。\\e,' + party + ',' + min);
            return Functools.Maybe.Nothing();
        });
    });

    TourabuEx.events.bind('timer/conquest/end',(_, p) => {
        var c = new Client();

        c.send('OnTourabuConquestEnd,とうらぶえくすてんしょん,\\0第' + p.party_no +
            '部隊が遠征から帰還しました。,' + p.party_no + ',' + p.field_id);
    });

    TourabuEx.events.bind('duty/start',() => {
        var c = new Client();
        c.send('OnTourabuDutyStart,とうらぶえくすてんしょん,内番を開始しました。');
    });

    TourabuEx.events.bind('timer/duty/end',(_, r) => {
        var c = new Client();
        c.send('OnTourabuDutyEnd,とうらぶえくすてんしょん,内番が終了しました。');
    });
}
