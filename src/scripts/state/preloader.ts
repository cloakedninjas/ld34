module Ldm34.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.game.add.sprite(0, 0, 'title');
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.spritesheet('play-btn', 'assets/images/play-btn.png', 186, 110, 2);

            this.load.image('baby-face', 'assets/images/baby-face.png');
            this.load.image('baby-tantrum-face', 'assets/images/baby-tantrum-face.png');
            this.load.image('baby-body', 'assets/images/baby-body.png');
            this.load.image('baby-mouth', 'assets/images/baby-mouth.png');
            this.load.image('baby-mouth-closed', 'assets/images/baby-mouth-closed.png');
            this.load.image('crosshair', 'assets/images/crosshair.png');
            this.load.image('background', 'assets/images/background.png');
            this.load.image('highchair', 'assets/images/highchair.png');
            this.load.image('pea', 'assets/images/food-pea.png');
            this.load.image('pea-splat', 'assets/images/food-pea-splat.png');
            this.load.image('carrot', 'assets/images/food-carrot.png');
            this.load.image('carrot-splat', 'assets/images/food-carrot-splat.png');
            this.load.image('watermelon', 'assets/images/food-watermelon.png');
            this.load.image('watermelon-splat', 'assets/images/food-watermelon-splat.png');
            this.load.image('cow', 'assets/images/food-cow.png');
            this.load.image('cow-splat', 'assets/images/food-cow-splat.png');
            this.load.image('grump-happy', 'assets/images/grump-happy.png');
            this.load.image('grump-medium', 'assets/images/grump-medium.png');
            this.load.image('grump-angry', 'assets/images/grump-angry.png');
            this.load.image('food-meter-under', 'assets/images/foodmeter-under.png');
            this.load.image('food-meter-fork', 'assets/images/foodmeter-fork.png');
            this.load.image('food-meter-bar', 'assets/images/foodmeter-green.png');
            this.load.image('clock', 'assets/images/clock.png');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            var tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('title', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
