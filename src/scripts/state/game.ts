module Ldm34.State {
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
        gameTimer:Entity.GameTimer;
        roundTimesPerLevel:number[];
        foodTypes:number[];
        roundNames:string[];

        create() {
            var game = this.game,
                totalHeight = Game.LEVEL_COUNT * game.height,
                bg = this.add.sprite(game.world.centerX, 0, 'background');

            bg.anchor.x = 0.5;

            this.roundTimesPerLevel = [20, 18, 16, 15, 14, 13, 12, 11, 10, 9, 8];
            this.foodTypes = [
                Entity.Food.TYPE_PEA,
                Entity.Food.TYPE_WHOLE_CARROT,
                Entity.Food.TYPE_WATERMELON,
                Entity.Food.TYPE_COW,
                Entity.Food.TYPE_HOUSE,
                Entity.Food.TYPE_PLANE,
                Entity.Food.TYPE_SATELLITE,
                Entity.Food.TYPE_MOON,
                Entity.Food.TYPE_PLANET,
                Entity.Food.TYPE_STAR,
                Entity.Food.TYPE_GALAXY
            ];
            this.roundNames = [
                'Baby',
                'Big Baby',
                'Bigger Baby',
                '??',
                '??',
                'My Big Strong Baby',
                '??',
                '??',
                'Baby: Eater of Worlds',
                '??',
                'Baby: Eater of Existence'
            ];

            game.world.setBounds(0, 0, game.width, totalHeight);
            game.camera.y = totalHeight - game.height;

            this.baby = new Entity.Baby(game, game.world.centerX, game.camera.y + game.height);
            this.add.existing(this.baby);

            var chair = game.add.sprite(game.world.centerX, totalHeight, 'highchair');
            chair.anchor.x = 0.5;
            chair.anchor.y = 1;

            this.uiGroup = new Phaser.Group(game);
            this.uiGroup.fixedToCamera = true;

            this.player = new Entity.Player(game);
            this.player.setCursorPosition();
            this.add.existing(this.player);

            this.grumpLevel = new Phaser.Sprite(game, 20, 20, 'grump-happy');
            this.uiGroup.add(this.grumpLevel);

            this.gameTimer = new Entity.GameTimer(game, this.grumpLevel.x + this.grumpLevel.width + 20, this.grumpLevel.y);
            this.uiGroup.add(this.gameTimer);

            this.foodMeter = new Entity.FoodMeter(game, this.gameTimer.x + this.gameTimer.width + 20, this.gameTimer.y);
            this.uiGroup.add(this.foodMeter);

            this.input.onDown.add(this.shootFood, this);
            this.baby.onEat.add(function () {
                this.foodMeter.setFill(this.baby.foodLevel / Entity.Baby.FOOD_LEVEL_REQUIREMENT);
            }, this);
            this.baby.onFull.add(this.handleBabyFull, this);
            this.baby.onAngerChange.add(this.handleAngerChange, this);
            this.gameTimer.onTimeLimitHit.add(this.handleTimeLimitHit, this);

            this.gameTimer.start(this.roundTimesPerLevel[0]);
            this.roundTransitioning = false;
            this.levelCounter = 1;
            this.roundCounter = 1;
        }

        render() {
            //this.game.debug.geom(this.baby.faceHitArea,'rgba(33,44,55,0.5)', true, 3);

            /*var x = this.baby.mouthHitArea.x,
             y = this.baby.mouthHitArea.y,
             w = this.baby.mouthHitArea.width,
             h = this.baby.mouthHitArea.height;
             this.game.debug.geom(
             new Phaser.Rectangle(x, y, w, h),
             'rgba(33,44,55,0.5)'
             );*/

            /*var points = <Phaser.Point[]>this.baby.mouthHitArea.points;

            var ctx = this.game.context;
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.moveTo((points[0].x + 0.5) - this.game.camera.x, (points[0].y + 0.5) - this.game.camera.y);

            points.forEach(function (point:Phaser.Point) {
                ctx.lineTo((point.x + 0.5) - this.game.camera.x, (point.y + 0.5) - this.game.camera.y);
            }, this);

            ctx.closePath();
            ctx.fill();*/
        }

        shootFood() {
            if (!this.roundTransitioning) {
                var foodType = this.foodTypes[this.levelCounter - 1],
                    food = new Entity.Food(this.game, this.player.position.x, this.player.position.y, this.baby, foodType);
                this.world.addChildAt(food, this.world.getChildIndex(this.player));
            }
        }

        /**
         * Pause crosshair, baby grows
         */
        beginNewRound() {
            this.removeGameControls();
            this.roundCounter++;
            this.baby.foodLevel = 0;
            this.foodMeter.setFill(0);
            this.gameTimer.start(this.roundTimesPerLevel[this.levelCounter - 1]);

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
            this.baby.clearSplats();

            if (this.levelCounter > Game.LEVEL_COUNT) {
                this.removeGameControls();
                this.gameOver();
                return;
            }

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

        private removeGameControls() {
            this.roundTransitioning = true;
            this.player.visible = false;
        }

        private continuePlaying() {
            this.player.visible = true;
            this.roundTransitioning = false;
        }

        private handleBabyFull() {
            this.beginNewRound();
        }

        private handleAngerChange(angerLevel:number) {
            if (angerLevel >= Entity.Baby.ANGER_ANGRY) {
                this.removeGameControls();
                this.baby.onAngerChange.remove(this.handleAngerChange);
                this.grumpLevel.loadTexture('grump-angry');
                this.gameOver();
            }
            else if (angerLevel >= Entity.Baby.ANGER_MEDIUM) {
                this.grumpLevel.loadTexture('grump-medium');
            }
            else {
                this.grumpLevel.loadTexture('grump-happy');
            }
        }

        private handleTimeLimitHit() {
            this.removeGameControls();
            this.baby.throwTantrum();
        }

        private gameOver() {
            this.gameTimer.running = false;

            var levelCounter = Math.min(this.levelCounter - 1, 11);
            var go = new Entity.GameOver(this.game, this.roundNames[levelCounter]);
            go.fixedToCamera = true;
            this.add.existing(go);
        }
    }
}
