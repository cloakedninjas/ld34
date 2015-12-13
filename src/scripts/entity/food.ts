module Ldm34.Entity {
    export class Food extends Phaser.Sprite {
        static TYPE_PEA:number = 1;
        game:Game;
        foodType:number;

        constructor(game:Game, x:number, y:number, foodType:number) {
            super(game, x, y);
            this.foodType = foodType || Food.TYPE_PEA;

            switch (this.foodType) {
                case Food.TYPE_PEA:
                    this.loadTexture('pea');
                    break;
            }
        }



    }
}