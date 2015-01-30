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
                this.forConquest();
                break;
            case 'conquest/cancel':
                break;
            default:
                //pass
            }
            return this;
        },
        forConquest: function () {
            console.log('dispatcher/conquest');
            this.maybe_body.fmap(function (body) {
                var param = {
                    party_no: body['party_no'][0],
                    field_id: body['field_id'][0],
                    type: 'conquest'
                };
                timer.conquest(param);
            });
        }
    };

}());
