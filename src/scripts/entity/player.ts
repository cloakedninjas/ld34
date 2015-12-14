module Ldm34.Entity {
    export class Player extends Phaser.Sprite {
        game:Game;

        constructor(game:Game) {
            super(game, game.world.centerX, game.world.centerX, 'crosshair');

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }

        update() {
            this.setCursorPosition();
        }

        setCursorPosition() {
            this.position.x = this.game.input.x;
            this.position.y = this.game.input.y + this.game.camera.y;
        }
    }
}