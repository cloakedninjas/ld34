module Ldm34.Entity {
    export class Baby extends Phaser.Sprite {
        game:Game;
        size:number;
        shrinkFactor:number;
        mouth:Phaser.Sprite;

        constructor(game:Game, x:number, y:number) {
            super(game, x, y, 'baby-face');
            this.shrinkFactor = 1;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

        }

        feed(food:number){
            this.size += food;
        }

        shrink() {
            this.size -= this.shrinkFactor;
        }

        update() {

        }

    }
}