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
}
