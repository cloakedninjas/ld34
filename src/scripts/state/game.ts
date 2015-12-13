module Ldm34.State {
    export class Game extends Phaser.State {

        baby:Entity.Baby;
        player:Entity.Player;

        create() {
            var game = this.game,
                bg = this.add.sprite(game.world.centerX, 0, 'background');
            bg.anchor.x = 0.5;

            this.baby = new Entity.Baby(game, game.world.centerX, game.world.centerY + 300);
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
            //this.game.debug.geom(this.baby.faceHitArea,'rgba(33,44,55,0.5)', true, 3);

            var x = this.baby.faceHitArea.x,
                y = this.baby.faceHitArea.y;
            this.game.debug.geom(
                new Phaser.Rectangle(x, y, this.baby.faceHitArea.width, this.baby.faceHitArea.height),
                'rgba(33,44,55,0.5)'
            );

        }
    }
}
