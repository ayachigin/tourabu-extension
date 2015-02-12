describe("events", function() {
    var e = TourabuEx.events;

    function bind(o) {
        e.bind('my/event', function (e, oo) {
            expect(oo).toEqual(o);
        });
    }

    it("binds and trigger an event", function() {
        var o = {hoge: 'hoga'};
        bind(o);
        e.trigger('my/event', o);
    });

    it('removes a bounded event', function () {
        e.bind('remove', function () {
            throw new Error('MyError');
        });

        e.unbind('remove');

        e.trigger('remove');
        expect(true).toBeTruthy();
    });
});
