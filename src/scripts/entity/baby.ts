module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        static TANTRUM_THRESHOLD:number = 30;

        game:Game;
        size:number;
        shrinkFactor:number;
        mouth:Phaser.Sprite;
        faceHitArea:Phaser.Circle;
        mouthHitArea:Phaser.Circle;
        foodSplats:Food[];
        anger:number = 0;
        angerIncrement:number = 1;

        constructor(game:Game, x:number, y:number) {
            super(game, x, y, 'baby-face');
            this.shrinkFactor = 1;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.faceHitArea = new Phaser.Circle(this.x, this.y, 460);
            this.foodSplats = [];
        }

        feed(food:number){
            this.size += food;
        }

        shrink() {
            this.size -= this.shrinkFactor;
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