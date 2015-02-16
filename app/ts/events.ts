/// <reference path="scripts/typings/jquery/jquery.d.ts" />
'use strict';

module TourabuEx.events {

    export interface Bind {
        (eventType: string, handler: (e: JQueryEventObject, a: any) => any): any;
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
        (eventType: string, any): any;
    }

    export var trigger: Trigger = function (eventType, o) {
        return $(TourabuEx).trigger.apply($(TourabuEx), arguments);
    }
} 