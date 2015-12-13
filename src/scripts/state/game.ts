module Ldm34.State {
    export class Game extends Phaser.State {

        baby:Entity.Baby;
        player:Entity.Player;

        create() {
            var game = this.game,
                bg = this.add.sprite(game.world.centerX, 0, 'background');
            bg.anchor.x = 0.5;

            this.baby = new Entity.Baby(game);
            this.baby.x = game.world.centerX;
            this.baby.y = game.world.centerY + 300;
            /*
             //this.baby.x = 700;
             //this.baby.y = 750;
             */
            this.add.existing(this.baby);

            var chair = game.add.sprite(game.world.centerX, game.height, 'highchair');
            chair.anchor.x = 0.5;
            chair.anchor.y = 1;

            this.player = new Entity.Player(game);
            this.add.existing(this.player);

            this.input.onDown.add(function () {
                var food = new Entity.Food(game, this.player.position.x, this.player.position.y, this.baby);
                this.world.addChildAt(food, this.world.getChildIndex(this.player));
            }, this);
        }

        render() {
            //this.game.debug.geom(this.baby.faceHitArea,'#cfffff');
        }
    }
}
