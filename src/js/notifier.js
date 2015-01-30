/* @flow */

var notifier = notifier || {};

notifier.defaultParams = function () {
    return {
        icon: "assets/icon_touken_128.png",
        title: "刀剣乱舞エクステンション",
        body: "",
        onClicked: function () { console.log("notification/clicked"); },
        onClosed:  function () { console.log("notification/closed"); },
        onShowed:  function () { console.log("notification/showed"); },
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
    return n;
};
