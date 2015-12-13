/// <reference path="../refs.d.ts" />

module Ldm34 {
    export class Game extends Phaser.Game {

        constructor() {
            super({
                width: 800,
                height: 600,
                renderer: Phaser.CANVAS
            });

            this.state.add('preloader', State.Preloader, true);
            this.state.add('game', State.Game);
        }
    }
}

// export Game to window
var Game = Ldm34.Game;

