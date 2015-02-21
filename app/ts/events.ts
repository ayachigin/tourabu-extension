/// <reference path="scripts/typings/jquery/jquery.d.ts" />
'use strict';

module TourabuEx.events {

    export interface Bind {
        (e: 'conquest/start', h: (ev: JQueryEventObject, r: RequestBody) => void);
        (e: 'conquest/cancel', h: (ev: JQueryEventObject, r: RequestBody) => void);
        (e: 'timer/conquest/end', h: (ev: JQueryEventObject, r: conquest.Param) => void);
        (e: 'duty/start', h: (ev: JQueryEventObject, r: RequestBody) => void);
        (e: 'message', h: (ev: JQueryEventObject, r: ReceivedMessage) => void);
        (e: string, h: (ev: JQueryEventObject, r: ReceivedMessage) => void);
        (e: string, handler: (ev: JQueryEventObject, a: any) => any);
    }

    export var bind: Bind = function bind(eventType, f) {
        return $(TourabuEx).bind.apply($(TourabuEx), arguments);
    }

    export interface Unbind {
        (eventType: string): void;
    }

    export var unbind: Unbind = function () {
        return $(TourabuEx).unbind.apply($(TourabuEx), arguments);
    }

    export interface Trigger {
        (e: string, any);
    }

    export var trigger: Trigger = function (eventType, o) {
        return $(TourabuEx).trigger.apply($(TourabuEx), arguments);
    }
} 