module Ldm34.State {
    export class Game extends Phaser.State {
        static LEVEL_COUNT:number = 2;

        baby:Entity.Baby;
        player:Entity.Player;
        roundCounter:number = 1;

        create() {
            var game = this.game,
                totalHeight = Game.LEVEL_COUNT * game.height,
                bg = this.add.sprite(game.world.centerX, 0, 'background');
            bg.anchor.x = 0.5;

            game.world.setBounds(0, 0, game.width, totalHeight);
            game.camera.y = totalHeight - game.height;

            this.baby = new Entity.Baby(game, game.world.centerX, game.camera.y + game.height);
            this.add.existing(this.baby);

            var chair = game.add.sprite(game.world.centerX, totalHeight, 'highchair');
            chair.anchor.x = 0.5;
            chair.anchor.y = 1;

            this.player = new Entity.Player(game);
            this.add.existing(this.player);

            this.input.onDown.add(function () {
                var food = new Entity.Food(game, this.player.position.x, this.player.position.y, this.baby);
                this.world.addChildAt(food, this.world.getChildIndex(this.player));
            }, this);

            this.baby.onFull.add(this.handleBabyFull, this);
        }

        render() {
            //this.game.debug.geom(this.baby.faceHitArea,'rgba(33,44,55,0.5)', true, 3);

            var x = this.baby.mouthHitArea.x,
                y = this.baby.mouthHitArea.y,
                w = this.baby.mouthHitArea.width,
                h = this.baby.mouthHitArea.height;
            this.game.debug.geom(
                new Phaser.Rectangle(x, y, w, h),
                'rgba(33,44,55,0.5)'
            );
        }

        beginNewLevel() {
            this.roundCounter++;

            var game = this.game,
                y = (game.height * Game.LEVEL_COUNT) - this.roundCounter * game.height;

            //console.log(this.game.camera.y, y);

            var tween = this.tweens.create(this.baby.scale).to({
                x: 1,
                y: 1
            }, 1200, Phaser.Easing.Sinusoidal.Out, true, 500);

            tween.onComplete.add(function () {
                var duration = 1000;

                this.tweens.create(this.camera).to({
                    y: y
                }, duration, Phaser.Easing.Sinusoidal.Out, true);

                this.tweens.create(this.baby).to({
                    y: this.baby.y - game.height
                }, duration, Phaser.Easing.Sinusoidal.Out, true);

                this.tweens.create(this.baby.scale).to({
                    x: Entity.Baby.START_SCALE,
                    y: Entity.Baby.START_SCALE
                }, duration, Phaser.Easing.Sinusoidal.Out, true);
            }, this);

        }

        private handleBabyFull() {
            this.beginNewLevel();
        }
    }
}
