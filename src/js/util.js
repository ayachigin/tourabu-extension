/* @flow */

var util = util || {};

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
