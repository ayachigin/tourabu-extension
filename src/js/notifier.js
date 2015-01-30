/* @flow */

var notifier = notifier || {};

notifier.defaultParams = function () {
    return {
        icon: "assets/icon_touken_128.png",
        title: "とうらぶえくすてんしょん",
        body: "",
        timeout: 0,
        onClicked: function () {
            console.log("notification/clicked");
            util.focusToukenRanbuTab();
        },
        onClosed:  function () { console.log("notification/closed"); },
        onShowed:  function () {
            var self = this;
            console.log('timeout/' + self.timeout);
            // タイムアウトがゼロなら表示しっぱなし
            if (self.timeout === 0) { return true; }
            // タイムアウトが設定されてたならnミリ秒後に消す
            else {
                setTimeout(function () {
                    self.close();
                }, self.timeout);
                return true;
            }
        },
        onError:   function () { console.log("notification/error"); }
    };
};

notifier.set = function (params) {
    var n = new window.Notification(params.title,
                                    {
                                        icon: params.icon,
                                        body: params.body
                                    });
    n.onclick = params.onClicked;
    n.onclose = params.onClosed;
    n.onshow  = params.onShowed;
    n.onerror = params.onError;
    n.timeout = params.timeout;
    return n;
};
