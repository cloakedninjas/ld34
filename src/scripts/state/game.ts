module Ldm34.State {
    import Baby = Ldm34.Entity.Baby;
    export class Game extends Phaser.State {
        static LEVEL_COUNT:number = 11;
        static ROUNDS_PER_LEVEL:number = 3;

        uiGroup:Phaser.Group;
        baby:Entity.Baby;
        player:Entity.Player;
        levelCounter:number = 1;
        roundCounter:number = 1;
        roundTransitioning:boolean = false;
        grumpLevel:Phaser.Sprite;
        foodMeter:Entity.FoodMeter;

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

            this.foodMeter = new Entity.FoodMeter(game, this.grumpLevel.x + this.grumpLevel.width + 20  , this.grumpLevel.y);
            this.uiGroup.add(this.foodMeter);

            this.input.onDown.add(this.shootFood, this);

            this.baby.onEat.add(function () {
                this.foodMeter.setFill(this.baby.foodLevel / Entity.Baby.FOOD_LEVEL_REQUIREMENT);
            }, this);
            this.baby.onFull.add(this.handleBabyFull, this);
            this.baby.onAngerChange.add(this.handleAngerChange, this);
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

        shootFood() {
            if (!this.roundTransitioning) {
                var food = new Entity.Food(this.game, this.player.position.x, this.player.position.y, this.baby);
                this.world.addChildAt(food, this.world.getChildIndex(this.player));
            }
        }

        /**
         * Pause crosshair, baby grows
         */
        beginNewRound() {
            this.roundTransitioning = true;
            this.player.visible = false;
            this.roundCounter++;
            this.baby.foodLevel = 0;
            this.foodMeter.setFill(0);

            if (this.roundCounter > Game.ROUNDS_PER_LEVEL) {
                this.beginNewLevel();
            }
            else {
                var scale = Entity.Baby.SCALE_ROUND_2;

                if (this.roundCounter === 3) {
                    scale = Entity.Baby.SCALE_ROUND_3;
                }

                var tween = this.baby.grow(scale);
                tween.onComplete.add(this.continuePlaying, this);
            }
        }

        /**
         * Pause crosshair, baby shrinks, camera pans
         */
        beginNewLevel() {
            this.roundCounter = 1;
            this.levelCounter++;

            var game = this.game,
                y = (game.height * Game.LEVEL_COUNT) - this.levelCounter * game.height,
                duration = 1000;

            this.tweens.create(this.camera).to({
                y: y
            }, duration, Phaser.Easing.Sinusoidal.Out, true);

            var tween = this.tweens.create(this.baby).to({
                y: this.baby.y - game.height
            }, duration, Phaser.Easing.Sinusoidal.Out, true);

            tween.onComplete.add(this.continuePlaying, this);

            this.baby.grow(Entity.Baby.SCALE_ROUND_1);
        }

        private continuePlaying() {
            this.player.visible = true;
            this.roundTransitioning = false;
        }

        private handleBabyFull() {
            this.beginNewRound();
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
