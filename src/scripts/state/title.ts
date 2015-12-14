module Ldm34.State {
    export class Title extends Phaser.State {

        create() {
            var game = this.game;

            game.add.sprite(0, 0, 'title');
            var btn = game.add.button(game.world.centerX, game.height - 200, 'play-btn', this.handleButtonClick, this, null, 0, 1, 0);
            btn.anchor.x = 0.5;
            btn.anchor.y = 1;

            var credit1 = game.add.text(10, game.height - 30, '@cloakedninjas', {
                    font: '20px Montserrat',
                    fill: 'rgba(255, 255, 255, 0.5)'
                }),

                credit2 = game.add.text(game.width - 120, game.height - 30, '@treslapin', {
                    font: '20px Montserrat',
                    fill: 'rgba(255, 255, 255, 0.5)'
                });

            credit1.inputEnabled = true;
            credit2.inputEnabled = true;

            credit1.events.onInputDown.add(this.handleCreditClick, this, null, credit1.text);
            credit2.events.onInputDown.add(this.handleCreditClick, this, null, credit2.text);
        }

        private handleButtonClick() {
            this.game.state.start('game', true);
        }

        private handleCreditClick(text, pointer, credit) {
            document.location.href = 'https://twitter.com/' + credit.replace('@', '');
        }
    }
}
