module Ldm34.Entity {
    export class Food extends Phaser.Sprite {
        static FLIGHT_SPEED:number = 500;
        static TYPE_PEA:number = 1;
        static TYPE_WHOLE_CARROT:number = 2;
        static TYPE_WATERMELON:number = 3;
        static TYPE_COW:number = 4;
        static TYPE_HOUSE:number = 5;
        static TYPE_PLANE:number = 6;
        static TYPE_SATELLITE:number = 7;
        static TYPE_MOON:number = 8;
        static TYPE_PLANET:number = 9;
        static TYPE_STAR:number = 10;
        static TYPE_GALAXY:number = 11;

        game:Game;
        baby:Baby;
        destination:Phaser.Point;
        foodType:number;
        flying:boolean = true;

        constructor(game:Game, destX:number, destY:number, baby:Baby, foodType?:number) {
            super(game, game.world.centerX, game.camera.y + game.height + 50);
            this.baby = baby;
            this.destination = new Phaser.Point(destX, destY);
            this.foodType = foodType || Food.TYPE_PEA;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.rotation = Math.random() * PIXI.PI_2;

            switch (this.foodType) {
                case Food.TYPE_PEA:
                    this.loadTexture('pea');
                    break;

                case Food.TYPE_WHOLE_CARROT:
                    this.loadTexture('carrot');
                    break;

                case Food.TYPE_WATERMELON:
                    this.loadTexture('watermelon');
                    break;

                case Food.TYPE_COW:
                    this.loadTexture('cow');
                    break;

                case Food.TYPE_HOUSE:
                    this.loadTexture('house');
                    break;

                case Food.TYPE_PLANE:
                    this.loadTexture('plane');
                    break;

                case Food.TYPE_SATELLITE:
                    this.loadTexture('satellite');
                    break;

                case Food.TYPE_MOON:
                    this.loadTexture('moon');
                    break;

                case Food.TYPE_PLANET:
                    this.loadTexture('planet');
                    break;

                case Food.TYPE_STAR:
                    this.loadTexture('star');
                    break;

                case Food.TYPE_GALAXY:
                    this.loadTexture('galaxy');
                    break;
            }

            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            if (this.flying) {
                this.game.physics.arcade.moveToXY(this, this.destination.x, this.destination.y, Food.FLIGHT_SPEED);
                this.rotation += 0.1;

                if (this.position.distance(this.destination) <= 10) {
                    this.body.velocity.setTo(0, 0);
                    this.flying = false;

                    this.baby.checkFoodLanded(this);
                }
            }
        }

        splat() {
            this.loadTexture(this.key + '-splat');

            /*var tween = this.game.tweens.create(this).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true, 1000);

            tween.onComplete.add(function () {
                this.destroy();
            }, this);*/
        }

        remove() {
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