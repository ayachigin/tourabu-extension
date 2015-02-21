/// <reference path="scripts/typings/chrome/chrome.d.ts" />
/*global Notification */
'use strict';

class Student {
    constructor(public name: string, public age: number) {
    }
}

module TourabuEx.notifier {
    export interface Param {
        title?: string;
        body?: string;
        icon?: string;
        status?: string;
        timeout?: number;
    }

    export interface ParamS {
        title: string;
        body: string;
        icon: string;
        status: string;
        timeout: number;
    }

    var defaultParam: Param = {
        title: 'とうらぶえくすてんしょん',
        body: '',
        status: '',
        icon: 'images/icon_touken_128.png',
        timeout: 0
    };

    declare class Notification {
        constructor(title: string, param: { icon: string; body: string });
        public onshow();
        public onclick();
        public close();
    }

    export function set(ps: Param): any {
        var ntype = TourabuEx.config.get('notification-type');
        var autohide = TourabuEx.config.get('notification-autohide');
        var param: ParamS = {
            title: ps.title || defaultParam.title,
            body: ps.body || defaultParam.body,
            icon: ps.icon || defaultParam.icon,
            status: ps.status || defaultParam.status,
            timeout: ps.timeout || defaultParam.timeout
        }

        if (ntype && !TourabuEx.util.isInfixOf(param.status, ntype)) {
            return;
        }

        if (autohide && TourabuEx.util.isInfixOf(param.status, autohide)) {
            param.timeout = 5000;
        } else {
            param.timeout = 0;
        }

        var n = new Notification(param.title, { icon: param.icon, body: param.body })

        n.onshow = function () {
            if (param.timeout !== 0) {
                setTimeout(function () {
                    n.close();
                }, param.timeout);
            }
        }

        n.onclick = function () {
            console.log('notification/clicked');
            TourabuEx.util.focusOrStartTourabu();
        }
    }
}