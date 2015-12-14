module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static ANGER_HAPPY:number = 0;
        static ANGER_MEDIUM:number = 20;
        static ANGER_ANGRY:number = 40;

        static SCALE_ROUND_1:number = 0.53;
        static SCALE_ROUND_2:number = 0.7;
        static SCALE_ROUND_3:number = 1;

        static GROW_DURATION:number = 1000;
        static FOOD_VALUE:number = 1;
        static FOOD_LEVEL_REQUIREMENT:number = 20;
        static BODY_ROCK_SPEED:number = 0.02;
        static HEAD_ROCK_SPEED:number = 0.03;
        static BODY_ROCK_VARIANCE:number = 10;
        static HEAD_ROCK_VARIANCE:number = 12;

        game:Game;
        face:Phaser.Sprite;
        mouth:Phaser.Sprite;
        faceHitArea:Phaser.Ellipse;
        mouthHitArea:Phaser.Ellipse;

        onEat:Phaser.Signal;
        onFull:Phaser.Signal;
        onAngerChange:Phaser.Signal;

        rockSpeed:number = Baby.BODY_ROCK_SPEED;
        rockVariance:number = Baby.BODY_ROCK_VARIANCE;
        rocking:boolean = true;
        mouthTimer:Phaser.TimerEvent;
        numberOfTicks:number = 0;
        mouthOpen:boolean = true;
        foodSplats:Food[];
        mouthFood:Food[];
        scaleIncrement:number;
        foodLevel:number = 0;
        anger:number = 0;
        angerIncrement:number = 1;
        angerDecrement:number = 0; //0.01;

        constructor(game:Game, x, y) {
            super(game, x, y, 'baby-body');

            this.anchor.x = 0.5;
            this.anchor.y = 0.75;

            this.face = new Phaser.Sprite(game, 0, -230, 'baby-face');
            this.face.anchor.x = 0.5;
            this.face.anchor.y = 1;
            this.addChild(this.face);

            this.mouth = new Phaser.Sprite(game, 0, -90, 'baby-mouth');
            this.mouth.anchor.x = 0.5;
            this.mouth.anchor.y = 0.5;
            this.face.addChild(this.mouth);

            this.faceHitArea = new Phaser.Ellipse(0, 0, 1, 1);
            this.mouthHitArea = new Phaser.Ellipse(0, 0, 1, 1);

            this.setScale(Baby.SCALE_ROUND_1);
            this.foodSplats = [];
            this.mouthFood = [];
            this.onEat = new Phaser.Signal();
            this.onFull = new Phaser.Signal();
            this.onAngerChange = new Phaser.Signal();
            this.mouthTimer = game.time.events.add(Lib.random(2000, 5000), this.toggleMouth, this);
        }

        setScale(scale:number) {
            this.scale.setTo(scale);
            this.faceHitArea.width = this.face.width * scale;
            this.faceHitArea.height = this.face.height * scale;

            this.faceHitArea.x = this.x + this.face.x - ((this.face.width * this.face.anchor.x) * scale);
            this.faceHitArea.y = this.y + (this.face.y * scale) - ((this.face.height * this.face.anchor.y) * scale);

            var mouthWidth = 260,
                mouthHeight = 158;

            this.mouthHitArea.width = mouthWidth * scale;
            this.mouthHitArea.height = mouthHeight * scale;

            this.mouthHitArea.x = this.x + this.face.x + this.mouth.x - ((mouthWidth * this.mouth.anchor.x) * scale);
            this.mouthHitArea.y = this.y + (this.face.y * scale) + (this.mouth.y * scale) - ((mouthHeight * this.mouth.anchor.y) * scale);

            this.scaleIncrement = (1 - scale) / Baby.FOOD_LEVEL_REQUIREMENT;
        }

        checkFoodLanded(food:Food) {
            var hitMouth = this.mouthHitArea.contains(food.x, food.y);

            if (this.mouthOpen && hitMouth) {
                food.remove();
                this.feed(food);
            }
            else if (this.faceHitArea.contains(food.x, food.y)) {
                food.splat();
                this.addSplat(food);

                if (hitMouth) {
                    this.mouthFood.push(food);
                }
            }
            else {
                food.remove();
            }
        }

        feed(food:Food) {
            if (this.mouthOpen) {
                this.foodLevel += Baby.FOOD_VALUE;
                this.onEat.dispatch();

                if (this.foodLevel >= Baby.FOOD_LEVEL_REQUIREMENT) {
                    this.onFull.dispatch();
                }
            }
            else {
                this.addSplat(food);
            }
        }

        toggleMouth() {
            this.mouthOpen = !this.mouthOpen;
            this.mouth.loadTexture(this.mouthOpen ? 'baby-mouth' : 'baby-mouth-closed');

            var duration = this.mouthOpen ? Lib.random(1000, 4000) : Lib.random(500, 3000);
            this.mouthTimer = this.game.time.events.add(duration, this.toggleMouth, this);

            if (!this.mouthOpen) {
                this.mouthFood.forEach(function (food:Food) {
                    food.destroy();
                }, this);

                this.mouthFood = [];
            }
        }

        addSplat(food:Food) {
            this.game.world.remove(food);
            this.face.addChild(food);
            this.foodSplats.push(food);

            food.x -= this.x;
            food.y -= this.y;

            var scale = this.scale.x;

            food.x -= this.face.x * scale;
            food.y -= this.face.y * scale;

            food.x /= scale;
            food.y /= scale;

            var newAngerLevel = this.anger + this.angerIncrement;
            this.checkAngerLevel(newAngerLevel);
            this.anger = newAngerLevel;

            if (this.anger >= Baby.ANGER_ANGRY) {
                this.throwTantrum();
            }
        }

        clearSplats() {
            this.foodSplats.forEach(function (food:Food, i:number) {
                food.destroy();
            }, this);
            this.foodSplats = [];
        }

        grow(scale:number) {
            this.game.time.events.add(Baby.GROW_DURATION + 1, this.setScale.bind(this, scale));
            return this.game.tweens.create(this.scale).to({
                x: scale,
                y: scale
            }, Baby.GROW_DURATION, Phaser.Easing.Sinusoidal.Out, true);
        }

        throwTantrum() {
            this.face.loadTexture('baby-tantrum-face');
            this.anger = Baby.ANGER_ANGRY;
            this.angerDecrement = 0;
            this.game.time.events.remove(this.mouthTimer);
            this.mouthOpen = true;
            this.mouth.loadTexture('baby-mouth');
            this.rocking = true;
            this.rockSpeed = 0.04;
            this.rockVariance = 15;
            this.onAngerChange.dispatch(this.anger);
        }

        update() {
            if (this.anger > 0) {
                var newAngerLevel = this.anger - this.angerDecrement;

                this.checkAngerLevel(newAngerLevel);
                this.anger = newAngerLevel;
            }

            if (this.rocking) {
                this.numberOfTicks++;
                this.angle = Math.sin(this.numberOfTicks * this.rockSpeed * Math.PI) * this.rockVariance;
                this.face.angle = Math.sin(this.numberOfTicks * Baby.HEAD_ROCK_SPEED * Math.PI) * Baby.HEAD_ROCK_VARIANCE;
            }
        }

        private checkAngerLevel(newAnger:number) {
            if (
                (this.anger < Baby.ANGER_MEDIUM && newAnger >= Baby.ANGER_MEDIUM) ||
                (this.anger < Baby.ANGER_ANGRY && newAnger >= Baby.ANGER_ANGRY) ||

                (this.anger >= Baby.ANGER_MEDIUM && newAnger < Baby.ANGER_MEDIUM) ||
                (this.anger >= Baby.ANGER_ANGRY && newAnger < Baby.ANGER_ANGRY)
            ) {
                if (newAnger >= Baby.ANGER_MEDIUM) {
                    this.face.loadTexture('baby-angry-face');
                }
                else if (newAnger >= Baby.ANGER_HAPPY) {
                    this.face.loadTexture('baby-face');
                }
                this.onAngerChange.dispatch(newAnger);
            }
        }
    }
}