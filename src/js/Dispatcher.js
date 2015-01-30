/* @flow */

var Dispatcher = Dispatcher || {},
    util = util || {},
    timer = timer || {},
    notifier = notifier;

(function () {
    'usestrict';

    Dispatcher = function (d) {
        this.method = d.method;
        this.maybe_body = util.nothing();
        this.keyword = d.url.split("/").slice(3).join("/");
        this.url = d.url;
        this.isPost = function () { return this.method === 'POST'; };
        this.isGet = function () { return this.method === 'GET'; };

        if (this.isPost()) {
            this.maybe_body = util.maybe(d.requestBody.formData);
            console.dir(this);
        }
    };

    Dispatcher.prototype = {
        go: function () {
            console.log('dispatcher/go');
            switch (this.keyword) {
            case 'conquest/start':
                this.forConquestStart();
                break;
            case 'conquest/cancel':
                this.forConquestCancel();
                break;
            default:
                //pass
            }
            return this;
        },
        forConquestStart: function () {
            console.log('dispatcher/conquest/start');
            this.maybe_body.fmap(function (body) {
                var party_no = body['party_no'][0],
                    field_id = body['field_id'][0],
                    param = {
                    party_no: party_no,
                    field_id: field_id,
                    type: 'conquest'
                    };

                timer.conquest(param);
            });
        },
        forConquestCancel: function () {
            console.log('dispatcher/conquest/cancel');
            this.maybe_body.fmap(function (body) {
                var party_no = body['party_no'][0];
                timer.cancel(function(o) {
                    return o.party_no === party_no;
                });
            });
        }
    };

}());
