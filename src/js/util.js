/* @flow */

var util = util || {},
    chrome = chrome || {};

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

Object.prototype.isEmpty = function () {
    return JSON.stringify(this) === '{}';
};

Array.prototype.isEmpty = function () {
    return JSON.stringify(this) === '[]';
};

// getToukenRanbuTab Deferred <string>
util.getToukenRanbuTab = function () {
    var d = $.Deferred(),
        isToukenRanbuUrl = function (u) {
            return ("://www.dmm.com/netgame/social/-/gadgets/=/" +
                    "app_id=825012/").isInfixOf(u);
        };

    chrome.windows.getAll(function (ws) {
        var wid, i, l = ws.length;
        for (i = 0; i < l; i++) {
            wid = ws[i].id;
            (function (i, l) {
                chrome.tabs.getAllInWindow(wid, function (tabs) {
                    var j, k = tabs.length, tab;
                    for (j = 0; j < k; j++) {
                        tab = tabs[j];
                        // 刀剣乱舞のたぶみつけた
                        if (isToukenRanbuUrl(tab.url)) {
                            console.log("touranTab found", tab.url);
                            d.resolve(tab.id);
                        } else if (i === l - 1 && j === k - 1) {
                            d.reject();
                        }
                    }
                });
            }(i, l));
        }
    });
    return d;
};

util.focusToukenRanbuTab = function () {
    util.getToukenRanbuTab().done(function (tabId) {
        chrome.tabs.update(tabId, {active: true});
    }).fail(function () {
        chrome.tabs.create({url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=825012/"});
    });
};

// lookup :: [(a, b)] -> a -> Maybe b
util.lookup = function lookup (m, k) {
    if (m.hasOwnProperty(k)) {
        return util.just(m[k]);
    } else {
        return util.nothing();
    }
};

util.maybe = (function () {
    function Maybe(v) {
        if (v !== null &&
            v !== undefined &&
            !(typeof(v) === "number" && isNaN(v))) {
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
            if (this.isJust()) return this.value;
            else return a;
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

util.just = function just(v) {
    return util.maybe(v);
};

util.nothing = function nothing() {
    return util.maybe(null);
};
