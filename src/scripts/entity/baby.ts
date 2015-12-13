module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static TANTRUM_THRESHOLD:number = 30;
        static START_SCALE:number = 0.53;
        static FOOD_VALUE:number = 1;
        static FOOD_LEVEL_REQUIREMENT:number = 20;

        game:Game;
        face:Phaser.Sprite;
        mouth:Phaser.Sprite;
        faceHitArea:Phaser.Ellipse;
        mouthHitArea:Phaser.Ellipse;

        onFull:Phaser.Signal;

        mouthOpen:boolean = true;
        foodSplats:Food[];
        scaleIncrement:number;
        foodLevel:number = 0;
        anger:number = 0;
        angerIncrement:number = 1;

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

        feed() {
            this.foodLevel += Baby.FOOD_VALUE;

            if (this.foodLevel === Baby.FOOD_LEVEL_REQUIREMENT) {
                this.onFull.dispatch();
            }
        }

        addSplat(food:Food) {
            this.foodSplats.push(food);
            this.anger += this.angerIncrement;

            if (this.anger >= Baby.TANTRUM_THRESHOLD) {
                this.startTantrum();
            }
        }

        startTantrum() {

        }


        update() {
            /*this.foodSplats.forEach(function (food) {

             }, this);*/
        }
    }
}