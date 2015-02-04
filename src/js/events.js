var TourabuEx = TourabuEx || {},
    $ = $ || function () {};

TourabuEx.events = (function () {
    return {
        bind: function () {
            return $(TourabuEx).bind.apply($(TourabuEx), arguments);
        },
        unbind: function () {
            return $(TourabuEx).unbind.apply($(TourabuEx), arguments);
        },
        trigger: function () {
            return $(TourabuEx).trigger.apply($(TourabuEx), arguments);
        },
        SECOND_CHANGE: 'second/change',
        TIMER_CONQUEST_END: 'timer/conquest/end'
    };
}());
