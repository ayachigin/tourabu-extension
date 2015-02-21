'use strict';

module TourabuEx {
    export class SEPlayer {
        private players: HTMLAudioElement[];

        /**
        @param uls List of audio file's url
        */
        constructor(urls: Array<string>) {
            this.players = [];
            urls.forEach((url) => {
                var filename = url.split('/').pop().split('.')[0];
                this.players[filename] = new Audio(url);
            })
        }

        /** play
        @param  filename  file name that you want to play
        */
        play(filename: string) {
            this.players[filename].play();
        }
    }
} 