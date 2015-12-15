module Ldm34.State {
    export class Title extends Phaser.State {
        game:Ldm34.Game;

        create() {
            var game = this.game,
                btn;

            game.bgMusic = game.sound.play('music');
            game.bgMusic.loop = true;

            game.add.sprite(0, 0, 'title');

            var y = 400;

            game.add.button(250, y, 'play-btn', this.handleButtonClick, this, null, 0, 1, 0);
            game.add.button(450, y, 'music-btn', this.handleMuteClick, this, null, 0, 1, 0);

            var credit1 = game.add.text(10, game.height - 30, '@cloakedninjas', {
                    font: '20px Montserrat',
                    fill: 'rgba(255, 255, 255, 0.5)'
                }),

                credit2 = game.add.text(200, game.height - 30, '@treslapin', {
                    font: '20px Montserrat',
                    fill: 'rgba(255, 255, 255, 0.5)'
                }),

                credit3 = game.add.text(690, game.height - 30, '♪♪ Credits', {
                    font: '20px Montserrat',
                    fill: 'rgba(255, 255, 255, 0.5)'
                });

            credit1.inputEnabled = true;
            credit2.inputEnabled = true;
            credit3.inputEnabled = true;

            credit1.events.onInputDown.add(this.handleCreditClick, this, null, credit1.text);
            credit2.events.onInputDown.add(this.handleCreditClick, this, null, credit2.text);
            credit3.events.onInputDown.add(this.handleCreditClick, this, null, 'credits');
        }

        private handleButtonClick() {
            this.game.state.start('game', true);
        }

        private handleMuteClick() {
            this.game.sound.mute = !this.game.sound.mute;
        }

        private handleCreditClick(text, pointer, credit) {
            if (credit === 'credits') {
                window.open('/credits.html', '_blank');
            }
            else {
                window.open('https://twitter.com/' + credit.replace('@', ''), '_blank');
            }
        }
    }
}
