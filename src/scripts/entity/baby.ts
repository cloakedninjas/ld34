module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static ANGER_HAPPY:number = 0;
        static ANGER_MEDIUM:number = 3;
        static ANGER_ANGRY:number = 6;

        static START_SCALE:number = 0.53;
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

        onFull:Phaser.Signal;
        onAngerChange:Phaser.Signal;

        rockSpeed:number = Baby.BODY_ROCK_SPEED;
        rockVariance:number = Baby.BODY_ROCK_VARIANCE;
        rocking:boolean = false;
        rockTimer:Phaser.TimerEvent;
        mouthTimer:Phaser.TimerEvent;
        numberOfTicks:number = 0;
        mouthOpen:boolean = true;
        foodSplats:Food[];
        scaleIncrement:number;
        foodLevel:number = 0;
        anger:number = 0;
        angerIncrement:number = 1;
        angerDecrement:number = 0.01;

        constructor(game:Game, x, y) {
            super(game, x, y, 'baby-body');

            this.anchor.x = 0.5;
            this.anchor.y = 0.75;

            this.scaleIncrement = (1 - Baby.START_SCALE) / Baby.FOOD_LEVEL_REQUIREMENT;

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

            this.setScale(1);
            //this.setScale(Baby.START_SCALE);
            this.foodSplats = [];
            this.onFull = new Phaser.Signal();
            this.onAngerChange = new Phaser.Signal();
            this.rockTimer = game.time.events.add(Lib.random(2000, 5000), this.rock, this);
            this.mouthTimer = game.time.events.add(Lib.random(2000, 5000), this.toggleMouth, this);
        }

        setScale(scale:number) {
            this.scale.setTo(scale);
            this.faceHitArea.width = this.face.width * scale;
            this.faceHitArea.height = this.face.height * scale;

            this.faceHitArea.x = this.x + this.face.x - ((this.face.width * this.face.anchor.x) * scale);
            this.faceHitArea.y = this.y + (this.face.y * scale) - ((this.face.height * this.face.anchor.y) * scale);

            this.mouthHitArea.width = this.mouth.width * scale;
            this.mouthHitArea.height = this.mouth.height * scale;

            this.mouthHitArea.x = this.x + this.face.x + this.mouth.x - ((this.mouth.width * this.mouth.anchor.x) * scale);
            this.mouthHitArea.y = this.y + (this.face.y * scale) + (this.mouth.y * scale) - ((this.mouth.height * this.mouth.anchor.y) * scale);
        }

        checkFoodLanded(food:Food) {
            if (this.mouthOpen && this.mouthHitArea.contains(food.x, food.y)) {
                food.remove();
                this.feed(food);
            }
            else if (this.faceHitArea.contains(food.x, food.y)) {
                food.splat();
                this.addSplat(food);
            }
            else {
                food.remove();
            }
        }

        feed(food:Food) {
            if (this.mouthOpen) {
                this.foodLevel += Baby.FOOD_VALUE;

                if (this.foodLevel === Baby.FOOD_LEVEL_REQUIREMENT) {
                    this.onFull.dispatch();
                }
            }
            else {
                this.addSplat(food);
            }
        }

        rock() {
            this.rocking = !this.rocking;

            var rockMax = this.rocking ? 10000 : 5000;
            this.rockTimer = this.game.time.events.add(Lib.random(2000, rockMax), this.rock, this);
        }

        toggleMouth() {
            this.mouthOpen = !this.mouthOpen;
            this.mouth.loadTexture(this.mouthOpen ? 'baby-mouth' : 'baby-mouth-closed');
            this.mouthTimer = this.game.time.events.add(Lib.random(2000, 7000), this.toggleMouth, this);
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
                this.game.time.events.remove(this.mouthTimer);
                this.game.time.events.remove(this.rockTimer);

                this.mouthOpen = true;
                this.rocking = true;
                this.rockSpeed = 0.04;
                this.rockVariance = 15;
            }
        }

        /*setFoodScale() {
            this.foodSplats.forEach(function (food:Food) {
                food.scale.x /= this.scale.x;
                food.scale.y /= this.scale.y;
            });
        }*/

        update() {
            if (this.anger > 0) {
                var newAngerLevel = this.anger - this.angerDecrement;

                this.checkAngerLevel(newAngerLevel);
                this.anger = newAngerLevel;
            }

            if (this.rocking) {
                //this.numberOfTicks++;
                //this.angle = Math.sin(this.numberOfTicks * this.rockSpeed * Math.PI) * this.rockVariance;
                //this.face.angle = Math.sin(this.numberOfTicks * Baby.HEAD_ROCK_SPEED * Math.PI) * Baby.HEAD_ROCK_VARIANCE;
            }
        }

        private checkAngerLevel(newAnger:number) {
            if (
                (this.anger < Baby.ANGER_MEDIUM && newAnger >= Baby.ANGER_MEDIUM) ||
                (this.anger < Baby.ANGER_ANGRY && newAnger >= Baby.ANGER_ANGRY) ||

                (this.anger >= Baby.ANGER_MEDIUM && newAnger < Baby.ANGER_MEDIUM) ||
                (this.anger >= Baby.ANGER_ANGRY && newAnger < Baby.ANGER_ANGRY)
            ) {
                this.onAngerChange.dispatch(newAnger);
            }
        }
    }
}