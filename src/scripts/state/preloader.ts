module Ldm34.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);
            this.load.image('baby-face', 'assets/images/baby-face.png');
            this.load.image('baby-body', 'assets/images/baby-body.png');
            this.load.image('baby-mouth', 'assets/images/baby-mouth.png');
            this.load.image('baby-mouth-closed', 'assets/images/baby-mouth-closed.png');
            this.load.image('crosshair', 'assets/images/crosshair.png');
            this.load.image('background', 'assets/images/background-nursery.png');
            this.load.image('highchair', 'assets/images/highchair.png');
            this.load.image('pea', 'assets/images/food-pea.png');
            this.load.image('pea-splat', 'assets/images/food-pea-splat.png');
            this.load.image('grump-happy', 'assets/images/grump-happy.png');
            this.load.image('grump-medium', 'assets/images/grump-medium.png');
            this.load.image('grump-angry', 'assets/images/grump-angry.png');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            var tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('game', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
