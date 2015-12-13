module Ldm34.State {
    export class Game extends Phaser.State {

        baby:Entity.Baby;
        player:Entity.Player;

        create() {
            var game = this.game;
            this.baby = new Entity.Baby(game, game.world.centerX, 200);
            this.add.existing(this.baby);

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
