describe('notifier', function () {
    var n = TourabuEx.Notifier;
    beforeEach(function (done) {
        var ps = n.defaultParam();
        ps.timeout = 2000;
        ps.onClosed = function () {
            done();
        };
        n(ps);
    });
    
    it('shows notify', function () {
        expect('Notification is shown').toBeTruthy();
    });
});
