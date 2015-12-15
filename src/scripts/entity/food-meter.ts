module Ldm34.Entity {
    export class FoodMeter extends Phaser.Group {
        static FILL_WIDTH:number = 136;
        static FILL_HEIGHT:number = 27;

        fillPercent:number = 0;
        bar:Phaser.BitmapData;
        barImage:Phaser.Sprite;

        constructor(game:Game, x:number, y:number) {
            super(game, null);
            this.x = x;
            this.y = y;

            this.barImage = new Phaser.Sprite(game, 28, 11);
            this.bar = new Phaser.BitmapData(game, 'food-meter-combined', FoodMeter.FILL_WIDTH, FoodMeter.FILL_HEIGHT);
            this.barImage.loadTexture(this.bar);

            this.add(new Phaser.Sprite(game, 0, 0, 'food-meter-under'));
            this.add(this.barImage);
            this.add(new Phaser.Sprite(game, 2, 2, 'food-meter-fork'));
            this.setFill(0);
        }

        setFill(fillPercent:number) {
            this.fillPercent = fillPercent;
            this.bar.clear();
            var ctx = this.bar.ctx;

            ctx.fillStyle = ctx.createPattern(this.game.cache.getImage('food-meter-bar'), 'repeat-x');
            ctx.fillRect(0, 0, this.bar.width * fillPercent, 100);
        }
    }
}