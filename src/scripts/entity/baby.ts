module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static ANGER_HAPPY:number = 0;
        static ANGER_MEDIUM:number = 3;
        static ANGER_ANGRY:number = 6;

        static START_SCALE:number = 0.53;
        static FOOD_VALUE:number = 1;
        static FOOD_LEVEL_REQUIREMENT:number = 20;
        static ROCK_SPEED:number = 0.02;

        game:Game;
        face:Phaser.Sprite;
        mouth:Phaser.Sprite;
        faceHitArea:Phaser.Ellipse;
        mouthHitArea:Phaser.Ellipse;

        onFull:Phaser.Signal;
        onAngerChange:Phaser.Signal;

        rocking:boolean = false;
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

            this.setScale(Baby.START_SCALE);
            this.foodSplats = [];
            this.onFull = new Phaser.Signal();
            this.onAngerChange = new Phaser.Signal();
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
            console.log('poop');
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
            this.rocking = true;
        }

        openMouth() {
            this.mouthOpen = true;
            this.mouth.loadTexture('baby-mouth');
        }

        closeMouth() {
            this.mouthOpen = false;
            this.mouth.loadTexture('baby-mouth-closed');
        }

        addSplat(food:Food) {
            this.foodSplats.push(food);
            var newAngerLevel = this.anger + this.angerIncrement;
            this.checkAngerLevel(newAngerLevel);
            this.anger = newAngerLevel;

            if (this.anger === Baby.ANGER_ANGRY) {

            }
        }

        update() {
            if (this.anger > 0) {
                var newAngerLevel = this.anger - this.angerDecrement;

                this.checkAngerLevel(newAngerLevel);
                this.anger = newAngerLevel;
            }

            if (this.rocking) {
                this.numberOfTicks++;
                this.angle = Math.sin(this.numberOfTicks * Baby.ROCK_SPEED * Math.PI) * 10;

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