module Ldm34.Entity {
    export class GameTimer extends Phaser.Sprite {

        game:Game;
        startTime:number;
        totalTime:number;
        running:boolean = false;
        fill:Phaser.BitmapData;
        fillImage:Phaser.Sprite;
        onTimeLimitHit:Phaser.Signal;

        constructor(game:Game, x:number, y:number) {
            super(game, x, y, 'clock');

            this.fill = new Phaser.BitmapData(game, 'food-meter-combined', this.width, this.height);
            this.fillImage = new Phaser.Sprite(game, 0, 0);
            this.fillImage.loadTexture(this.fill);
            this.addChild(this.fillImage);
            this.onTimeLimitHit = new Phaser.Signal();
        }

        start(totalTime:number) {
            this.totalTime = totalTime;
            this.startTime = (new Date()).getTime();
            this.running = true;
        }

        update() {
            var elapsed = (new Date().getTime() - this.startTime) / this.totalTime;

            if (elapsed >= 1) {
                this.running = false;
                this.onTimeLimitHit.dispatch();
            }

            if (this.running) {
                this.fill.clear();

                var ctx = this.fill.ctx,
                    x = 26,
                    y = 26,
                    radius = 22,
                    startAngle = -90 * PIXI.DEG_TO_RAD,
                    endAngle = (PIXI.PI_2 * elapsed) + startAngle;

                ctx.fillStyle = 'rgb(111, 120, 159)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, 4);
                ctx.arc(x, y, radius, startAngle, endAngle);
                ctx.lineTo(x, y);
                ctx.lineTo(x, 4);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}