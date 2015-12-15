module Ldm34.Entity {
    export class GameTimer extends Phaser.Sprite {
        startTime:number;
        totalTime:number;
        running:boolean = false;
        playingSound:boolean = false;
        sound:Phaser.Sound;
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

        /**
         *
         * @param totalTime in seconds
         */
        start(totalTime:number) {
            this.totalTime = totalTime * Phaser.Timer.SECOND;
            this.startTime = (new Date()).getTime();
            this.running = true;

            if (this.sound && this.sound.isPlaying) {
                this.sound.stop();
            }
        }

        update() {
            if (this.running) {
                var now = (new Date()).getTime(),
                    elapsed = now - this.startTime,
                    complete = elapsed / this.totalTime;

                if (complete >= 1) {
                    this.sound.stop();
                    this.running = false;
                    this.onTimeLimitHit.dispatch();
                }
                else if (this.totalTime - elapsed <= 5000 && !this.playingSound) {
                    this.playingSound = true;
                    this.sound = this.game.sound.play('tick-tock', 1, true);
                }

                this.fill.clear();

                var ctx = this.fill.ctx,
                    x = 26,
                    y = 26,
                    radius = 22,
                    startAngle = -90 * PIXI.DEG_TO_RAD,
                    endAngle = (PIXI.PI_2 * complete) + startAngle;

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