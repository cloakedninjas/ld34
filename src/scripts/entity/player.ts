module Ldm34.Entity {
    export class Player extends Phaser.Sprite {
        static TRACK_SPEED:number = 300; // PX / s
        static SAFE_ZONE:number = 10;
        game:Game;
        safeZone:Phaser.Rectangle;

        constructor(game:Game) {
            super(game, game.world.centerX, game.world.centerX, 'crosshair');

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.scale.x = this.scale.y = 0.2;

            var spread = 50;
            this.safeZone = new Phaser.Rectangle(-(this.width / 2) - spread, -(this.height / 2) - spread, spread * 2, spread *2);

            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            if (this.position.distance(this.game.input.position) <= Player.SAFE_ZONE) {
                this.body.velocity.setTo(0, 0);
                this.position.x = this.game.input.x;
                this.position.y = this.game.input.y;
            }
            else {
                this.game.physics.arcade.moveToPointer(this, Player.TRACK_SPEED);
            }

            /*if (
                (this.x >= this.game.input.x - spread && this.x <= this.game.input.x - spread) &&
                (this.y >= this.game.input.y + spread && this.y <= this.game.input.y - spread)
            ) {
                this.body.velocity.setTo(0, 0);
            }
            else {
                this.game.physics.arcade.moveToPointer(this, Player.TRACK_SPEED);

            }*/
        }
    }
}