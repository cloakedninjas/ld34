/// <reference path="../refs.d.ts" />

module Ldm34 {
    export class Game extends Phaser.Game {

        bgMusic:Phaser.Sound;

        constructor() {
            super({
                width: 800,
                height: 600,
                renderer: Phaser.CANVAS
            });

            this.state.add('boot', State.Boot, true);
            this.state.add('preloader', State.Preloader);
            this.state.add('title', State.Title);
            this.state.add('game', State.Game);
        }
    }
}

// export Game to window
var Game = Ldm34.Game;

