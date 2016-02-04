'use strict';

module TourabuEx {
    var d: Dispatcher;

    export interface RequestBody {
        url: string;
        id: string;
        body: {
            party_no?: string[];
            field_id?: string[];
        };
    }

    export interface RepairRequestBody {
        url: string;
        id: string;
        body: {
            slot_no: string[];
            use_assist: string[];
        }
    }

    export interface Message {
        type: string;
        body: any;
    }

    export interface ReceivedMessage {
        message: any;
        sender: chrome.runtime.MessageSender;
        sendResponse: Function;
    }

    export class Dispatcher {
        constructor() {
            if (d) { return d; }

            d = this;
        }

        init() {
            this.startListeningRequest();
            this.startListeningMessage();
            this.startCountingTime();
        }

        startListeningMessage() {
            chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
                TourabuEx.events.trigger('message/' + message.type, <ReceivedMessage> {
                    message: message.body,
                    sender: sender,
                    sendResponse: sendResponse
                })
            });
        }

        startListeningRequest() {
            // request
            chrome.webRequest.onBeforeRequest.addListener(
                (r) => {
                    if (r.method === 'GET') { return {}; }
                    
                    // http://w003.touken-ranbu.jp/mission/index の mission/index の部分
                    var eventType = r.url.split('?')[0].split('/').slice(3).join('/'),
                        param: RequestBody = { id: r.requestId, url: r.url, body: r.requestBody.formData };

                    TourabuEx.events.trigger(eventType, param);
                },
                { urls: ['*://*.touken-ranbu.jp/*'] },
                ['requestBody']);

            // complete
            chrome.webRequest.onCompleted.addListener((r) => {
                if (r.method === 'GET' ||
                    (r.statusCode >= 300 && r.statusCode < 200)) {
                    return {};
                }

                var eventType = 'complete/' + r.url.split('?')[0].split('/').slice(3).join('/'),
                    id = r.requestId;

                TourabuEx.events.trigger(eventType, id);
                return {};
            }, {urls: ['<all_urls>'] });
        }

        startCountingTime() {
            setInterval(() => {
                TourabuEx.events.trigger('second/change', Math.floor(Date.now() / 1000));
            }, 1000)
        }

    }
} 