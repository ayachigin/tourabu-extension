'use strict';

var TourabuEx = TourabuEx || {},
    chrome = chrome || {};

// プロトタイプ拡張

String.prototype.isPrefixOf = function (s) {
    return s.slice(0, this.length) === '' + this;
};

String.prototype.isInfixOf = function (s) {
    return s.indexOf(this) !== -1;
};

String.prototype.isSuffixOf = function (s) {
    return s.slice(-this.length) === '' + this;
};

// remove an element at index
Array.prototype.popAt = function (index) {
    if (index >= 0 && index < this.length) {
        this.splice(index, 1);
    }
    return this;
};

Array.prototype.removeAt = function (index) {
    this.popAt(index);
};

Object.prototype.isEmpty = function () {
    return JSON.stringify(this) === '{}';
};

Array.prototype.isEmpty = function () {
    return JSON.stringify(this) === '[]';
};

Date.prototype.isValid = function () {
    return this.toString() !== 'Invalid Date';
};

// ゆーてれてーかんすー
TourabuEx.util = {};

// getToukenRanbuTab Deferred <tab>
TourabuEx.util.getToukenRanbuTab = function () {
    var d = $.Deferred(),
        isToukenRanbuUrl = function (u) {
            return ('://www.dmm.com/netgame/social/-/gadgets/=/' +
                    'app_id=825012/').isInfixOf(u);
        };

    function findTourabuTab(wid, i, l) {
        chrome.tabs.getAllInWindow(wid, function (tabs) {
            var j, k = tabs.length, tab;
            for (j = 0; j < k; j++) {
                tab = tabs[j];
                // 刀剣乱舞のたぶみつけた
                if (isToukenRanbuUrl(tab.url)) {
                    console.log('touranTab found', tab.url);
                    d.resolve(tab);
                } else if (i === l - 1 && j === k - 1) {
                    d.reject();
                }
            }
        });
    }

    chrome.windows.getAll(function (ws) {
        var wid, i, l = ws.length;
        for (i = 0; i < l; i++) {
            wid = ws[i].id;

            findTourabuTab(wid, i, l);
        }
    });
    return d;
};

TourabuEx.util.focusToukenRanbuTab = function () {
    TourabuEx.util.getToukenRanbuTab().done(function (tab) {
        chrome.tabs.update(tab.id, {active: true});
    }).fail(function () {
        chrome.tabs.create({url: 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=825012/'});
    });
};

TourabuEx.util.prettyPrintMiliseconds = function (milisec) {
    var r       = '',
        day     = 24 * 60 * 60 * 1000,
        hour    = 60 * 60 * 1000,
        minute = 60 * 1000,
        second  = 1000;

    if (milisec >= day) {
        r += parseInt(milisec / day, 10).toString() + '日';
        milisec = milisec % day;
    }

    if (milisec >= hour) {
        r += parseInt(milisec / hour, 10).toString() + '時間';
        milisec = milisec % hour;
    }

    if (milisec >= minute) {
        r += parseInt(milisec / minute, 10).toString() + '分';
        milisec = milisec % minute;
    }

    if (milisec >= second) {
        r += parseInt(milisec / second, 10).toString() + '秒';
        milisec = milisec % second;
    }

    return r;
};

// lookup :: [(a, b)] -> a -> Maybe b
TourabuEx.util.lookup = function lookup (m, k) {
    if (m.hasOwnProperty(k)) {
        return TourabuEx.util.just(m[k]);
    } else {
        return TourabuEx.util.nothing();
    }
};

TourabuEx.util.maybe = (function () {
    function Maybe(v) {
        if (v !== null &&
            v !== undefined &&
            !(typeof(v) === 'number' && isNaN(v))) {
            this.hasValue = true;
            this.value = v;
        } else {
            this.hasValue = false;
        }
    }

    Maybe.prototype = {
        fmap: function (f) {
            if (this.hasValue) {
                return new Maybe(f(this.value));
            } else {
                return this;
            }
        },

        fromMaybe: function (a) {
            if (this.isJust()) { return this.value; }
            else { return a; }
        },

        isJust: function () {
            return this.hasValue;
        },

        isNothing: function () {
            return !this.isJust();
        }
    };

    return function (v) { return new Maybe(v); };
}());

TourabuEx.util.just = function just(v) {
    return TourabuEx.util.maybe(v);
};

TourabuEx.util.nothing = function nothing() {
    return TourabuEx.util.maybe(null);
};
