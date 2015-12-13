module Ldm34.Entity {
    export class Player extends Phaser.Sprite {
        static TRACK_SPEED:number = 400; // PX / s
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
            var pos = this.worldPosition;
            if (
                (pos.x >= this.game.input.x - Player.SAFE_ZONE && pos.x <= this.game.input.x + Player.SAFE_ZONE) &&
                (pos.y >= this.game.input.y - Player.SAFE_ZONE && pos.y <= this.game.input.y + Player.SAFE_ZONE)
            ) {
                this.body.velocity.setTo(0, 0);
                this.position.x = this.game.input.x;
                this.position.y = this.game.input.y + this.game.camera.y;
            }
            else {
                this.game.physics.arcade.moveToPointer(this, Player.TRACK_SPEED);
            }
        }
    }
}