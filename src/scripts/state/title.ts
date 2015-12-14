module Ldm34.State {
    export class Title extends Phaser.State {

        create() {
            var game = this.game;
            game.add.sprite(0, 0, 'title');
            var btn = game.add.button(game.world.centerX, game.height - 200, 'play-btn', this.handleButtonClick, this, null, 0, 1, 0);
            btn.anchor.x = 0.5;
            btn.anchor.y = 1;
        }

        private handleButtonClick() {
            this.game.state.start('game', true);
        }
    }
}
