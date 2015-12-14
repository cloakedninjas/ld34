module Ldm34.Entity {
    export class GameOver extends Phaser.Sprite {
        game:Game;

        constructor(game:Game, level:string) {
            super(game, 0, 0);

            var bmd = new Phaser.BitmapData(game, 'game-over', game.width, game.height),
                ctx = bmd.ctx;

            ctx.fillStyle = '#ed1c24';
            ctx.fillRect(0, 140, game.width, 110);

            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = '100px Righteous';
            ctx.fillText('GAME OVER!', game.world.centerX, 230);

            var width = 300;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(game.world.centerX - width, 290, width * 2, 38);

            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.font = 'bold 30px Montserrat';
            ctx.fillText('You reached: ' + level, game.world.centerX, 320);

            this.loadTexture(bmd);

            var buttonSprite = new Phaser.Sprite(game, game.world.centerX, 435);
            bmd = new Phaser.BitmapData(game, 'game-over', 160, 66);
            ctx = bmd.ctx;

            ctx.fillStyle = '#ed1c24';
            ctx.fillRect(0, 0, bmd.width, bmd.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 32px Montserrat';
            ctx.fillText('REPLAY?', bmd.width / 2, 44);

            buttonSprite.loadTexture(bmd);
            buttonSprite.anchor.x = 0.5;
            buttonSprite.inputEnabled = true;
            buttonSprite.events.onInputDown.add(this.handleButtonClick, this);
            this.addChild(buttonSprite);
        }

        private handleButtonClick() {
            this.game.state.start('title', true);
        }
    }
}