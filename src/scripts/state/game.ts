module Ldm34.State {
    export class Game extends Phaser.State {
        static LEVEL_COUNT:number = 11;

        uiGroup:Phaser.Group;
        baby:Entity.Baby;
        player:Entity.Player;
        roundCounter:number = 1;
        roundTransitioning:boolean = false;
        grumpLevel:Phaser.Sprite;

        create() {
            var game = this.game,
                totalHeight = Game.LEVEL_COUNT * game.height,
                bg = this.add.sprite(game.world.centerX, 0, 'background');
            bg.anchor.x = 0.5;

            this.uiGroup = new Phaser.Group(game);
            this.uiGroup.fixedToCamera = true;

            game.world.setBounds(0, 0, game.width, totalHeight);
            game.camera.y = totalHeight - game.height;

            this.baby = new Entity.Baby(game, game.world.centerX, game.camera.y + game.height);
            this.add.existing(this.baby);

            var chair = game.add.sprite(game.world.centerX, totalHeight, 'highchair');
            chair.anchor.x = 0.5;
            chair.anchor.y = 1;

            this.player = new Entity.Player(game);
            this.player.setCursorPosition();
            this.add.existing(this.player);

            this.grumpLevel = new Phaser.Sprite(game, 20, 20, 'grump-happy');
            this.uiGroup.add(this.grumpLevel);

            this.input.onDown.add(this.shootFood, this);

            this.baby.onFull.add(this.handleBabyFull, this);
            this.baby.onAngerChange.add(this.handleAngerChange, this);
        }

        /*render() {
            //this.game.debug.geom(this.baby.faceHitArea,'rgba(33,44,55,0.5)', true, 3);

            var x = this.baby.mouthHitArea.x,
                y = this.baby.mouthHitArea.y,
                w = this.baby.mouthHitArea.width,
                h = this.baby.mouthHitArea.height;
            this.game.debug.geom(
                new Phaser.Rectangle(x, y, w, h),
                'rgba(33,44,55,0.5)'
            );
        }*/

        shootFood() {
            if (!this.roundTransitioning) {
                var food = new Entity.Food(this.game, this.player.position.x, this.player.position.y, this.baby);
                this.world.addChildAt(food, this.world.getChildIndex(this.player));
            }
        }

        beginNewLevel() {
            this.roundTransitioning = true;
            this.player.visible = false;
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

                tween = this.tweens.create(this.baby.scale).to({
                    x: Entity.Baby.START_SCALE,
                    y: Entity.Baby.START_SCALE
                }, duration, Phaser.Easing.Sinusoidal.Out, true);

                tween.onComplete.add(function () {
                    this.baby.setScale(Entity.Baby.START_SCALE);
                    this.player.visible = true;
                    this.roundTransitioning = false;
                }, this);
            }, this);

        }

        private handleBabyFull() {
            this.beginNewLevel();
        }

        private handleAngerChange(angerLevel:number) {
            if (angerLevel>= Entity.Baby.ANGER_ANGRY) {
                this.grumpLevel.loadTexture('grump-angry');
            }
            else if (angerLevel >= Entity.Baby.ANGER_MEDIUM) {
                this.grumpLevel.loadTexture('grump-medium');
            }
            else {
                this.grumpLevel.loadTexture('grump-happy');
            }
        }
    }
}
