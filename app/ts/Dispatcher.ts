'use strict';

module TourabuEx {
    var d: Dispatcher;

    export interface RequestBody {
        url: string;
        body: {
            party_no?: string[];
            field_id?: string[];
        };
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
            if (d) {
                return d;
            }

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
            chrome.webRequest.onBeforeRequest.addListener(
                (r) => {
                    if (r.method === 'GET') { return {}; }
                    
                    // http://w003.touken-ranbu.jp/mission/index の mission/index の部分
                    var eventType = r.url.split('/').slice(3).join('/'),
                        param: RequestBody = { url: r.url, body: r.requestBody.formData };

                    TourabuEx.events.trigger(eventType, param);
                },
                { urls: ['*://*.touken-ranbu.jp/*'] },
                ['requestBody']);
        }

        startCountingTime() {
            setInterval(() => {
                TourabuEx.events.trigger('second/change', Math.floor(Date.now() / 1000));
            }, 1000)
        }

    }
} 