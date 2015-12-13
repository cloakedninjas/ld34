module Ldm34.Entity {
    export class Food extends Phaser.Sprite {
        static FLIGHT_SPEED:number = 500;
        static TYPE_PEA:number = 1;
        game:Game;
        baby:Baby;
        destination:Phaser.Point;
        foodType:number;
        flying:boolean = true;

        constructor(game:Game, destX:number, destY:number, baby:Baby, foodType?:number) {
            super(game, game.world.centerX, game.world.height + 100);
            this.baby = baby;
            this.destination = new Phaser.Point(destX, destY);
            this.foodType = foodType || Food.TYPE_PEA;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            switch (this.foodType) {
                case Food.TYPE_PEA:
                    this.loadTexture('pea');
                    break;
            }

            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            if (this.flying) {
                this.game.physics.arcade.moveToXY(this, this.destination.x, this.destination.y, Food.FLIGHT_SPEED);

                if (this.position.distance(this.destination) <= 10) {
                    this.body.velocity.setTo(0, 0);
                    this.flying = false;

                    if (this.baby.faceHitArea.contains(this.x, this.y)) {
                        this.baby.addSplat(this);
                    }
                    else {
                        var tween = this.game.tweens.create(this.scale).to({
                            x: 0,
                            y: 0
                        }, 200, Phaser.Easing.Linear.None, true);

                        tween.onComplete.add(function () {
                            this.destroy();
                        }, this);
                    }
                }
            }
        }

    }
}