/// <reference path="scripts/typings/chrome/chrome.d.ts" />
/// <reference path="tourabuex.ts" />
/// <reference path="scripts/typings/jquery/jquery.d.ts" />
'use strict';

module TourabuEx.util {
    // String
    export var isPrefixOf: (a: string, b: string) => boolean = function (a, b) {
        return b.indexOf(a) === 0;
    }

    export var isInfixOf = function (a: string, b: string) {
        return b.indexOf(a) !== -1;
    }

    export function isSuffixOf(a: string, b: string) {
        return b.indexOf(a) === b.length - a.length;
    }

    // Array
    export function popAt<T>(ls: T[], i: number): T {
        var v = ls[i];
        ls.splice(i, 1);
        return v;
    }

    export function removeAt(ls: any[], i: number): void {
        popAt(ls, i);
    }

    // Object
    export function isEmpty(o: any): boolean {
        var s = JSON.stringify(o);
        return o === '' || s === '{}' || s === '[]';
    }

    // Date
    export function isValid(d: Date): boolean {
        return d.toString() !== 'Invalid Date';
    }

    export var GAME_URL = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=825012/';

    function findTourabuTab(d, wid: number, i: number, l: number): void {
        chrome.tabs.query({ windowId: wid }, function (tabs) {
            var j: number,
                k = tabs.length,
                tab: chrome.tabs.Tab;

            for (j = 0; j < k; j++) {
                tab = tabs[j];
                if (isInfixOf(GAME_URL, tab.url)) {
                    d.resolve(tab);
                } else if (i === l - 1 && j === k - 1) {
                    d.reject();
                }
            }
        })
    }    

    export function getToukenranbuTab(): JQueryDeferred<chrome.tabs.Tab> {
        var d = $.Deferred();
        chrome.windows.getAll(function (ws) {
            var wid, i, l = ws.length;
            for (i = 0; i < l; i++) {
                findTourabuTab(d, wid, i, l);
            }
        });
        return d;
    }

    export function focusTourabu(tab?: chrome.tabs.Tab): void {
        function focus(tab: chrome.tabs.Tab) {
            chrome.windows.update(tab.windowId, { focused: true });
            chrome.tabs.update(tab.id, { active: true });
        }

        if (tab) {
            return focus(tab);
        } else {
            getToukenranbuTab().done(function (tab) {
                focus(tab);
            });
        }
    }

    export function startTourabuWidget() {
        chrome.windows.create({
            url: GAME_URL,
            type: 'popup',
            width: 960,
            height: 580
        });
    }

    export function focusOrStartTourabu() {
        getToukenranbuTab().done(function (tab) {
            focusTourabu(tab);
        }).fail(function () {
            startTourabuWidget();
        });
    }
}
