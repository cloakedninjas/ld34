module Ldm34.Entity {
    export class GameOver extends Phaser.Group {
        game:Game;

        constructor(game:Game, level:string) {
            super(game);
            this.game = game;

            var bmd = new Phaser.BitmapData(game, 'game-over', game.width, game.height),
                ctx = bmd.ctx;

            ctx.fillStyle = '#ed1c24';
            ctx.fillRect(0, 140, game.width, 110);

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '100px Righteous';
            ctx.fillText('GAME OVER!', game.world.centerX, 230);

            var width = 257;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(game.world.centerX - width, 290, width * 2, 38);

            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = 'bold 30px Montserrat';
            ctx.fillText('You reached: ' + level, game.world.centerX, 320);

            var sprite = new Phaser.Sprite(game, 0, 0, bmd);
            this.add(sprite);

            var btn = new Phaser.Button(game, game.world.centerX, 435, 'play-btn', this.handleButtonClick, this, null, 0, 1, 0);
            btn.anchor.x = 0.5;
            this.add(btn);

            this.fixedToCamera = true;
        }

        private handleButtonClick() {
            this.game.state.start('title', true);
        }
    }
}