module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static TANTRUM_THRESHOLD:number = 30;
        static START_SCALE:number = 0.53;
        static FOOD_VALUE:number = 1;
        static FOOD_LEVEL_REQUIREMENT:number = 20;

        game:Game;
        size:number;
        shrinkFactor:number;
        face:Phaser.Sprite;
        mouth:Phaser.Sprite;
        faceHitArea:Phaser.Ellipse;
        mouthHitArea:Phaser.Ellipse;
        mouthOpen:boolean = true;
        foodSplats:Food[];
        scaleIncrement:number;
        anger:number = 0;
        angerIncrement:number = 1;

        constructor(game:Game, x, y) {
            super(game, x, y, 'baby-body');

            this.anchor.x = 0.5;
            this.anchor.y = 0.75;

            //this.pivot.x = 260;
            //this.pivot.y = 515;
            this.scaleIncrement = (1 - Baby.START_SCALE) / Baby.FOOD_LEVEL_REQUIREMENT;

            this.face = new Phaser.Sprite(game, 0, -230, 'baby-face');
            this.face.anchor.x = 0.5;
            this.face.anchor.y = 1;
            this.addChild(this.face);

            this.mouth = new Phaser.Sprite(game, 0, -90, 'baby-mouth');
            this.mouth.anchor.x = 0.5;
            this.mouth.anchor.y = 0.5;
            this.face.addChild(this.mouth);

            this.faceHitArea = new Phaser.Ellipse(0, 0, this.face.width, this.face.height);
            //this.mouthHitArea = new Phaser.Circle(this.x, this.y, 460);

            this.setScale(1); //Baby.START_SCALE
            this.foodSplats = [];
        }

        setScale(scale:number) {
            this.scale.setTo(scale);
            this.faceHitArea.width = this.face.width * scale;
            this.faceHitArea.height = this.face.height * scale;

            this.faceHitArea.x = this.x + this.face.x - ((this.face.width * this.face.anchor.x) * scale);
            this.faceHitArea.y = this.y + this.face.y - ((this.face.height * this.face.anchor.y) * scale);
        }

        feed(){
            var increment = Baby.FOOD_VALUE;
            this.size += increment;
            this.scale.add(this.scaleIncrement * increment, this.scaleIncrement * increment);
        }

        addSplat(food:Food) {
            this.game.world.remove(food);
            this.addChild(food);
            food.x = food.x - this.x;
            food.y = food.y - this.y;
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