module Ldm34.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.game.add.sprite(0, 0, 'title');
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.spritesheet('play-btn', 'assets/images/play-btn.png', 186, 110, 2);

            this.load.image('baby-face', 'assets/images/baby-face.png');
            this.load.image('baby-angry-face', 'assets/images/baby-angry-face.png');
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
            this.load.image('galaxy', 'assets/images/food-galaxy.png');
            this.load.image('galaxy-splat', 'assets/images/food-galaxy-splat.png');
            this.load.image('house', 'assets/images/food-house.png');
            this.load.image('house-splat', 'assets/images/food-house-splat.png');
            this.load.image('moon', 'assets/images/food-moon.png');
            this.load.image('moon-splat', 'assets/images/food-moon-splat.png');
            this.load.image('plane', 'assets/images/food-plane.png');
            this.load.image('plane-splat', 'assets/images/food-plane-splat.png');
            this.load.image('planet', 'assets/images/food-planet.png');
            this.load.image('planet-splat', 'assets/images/food-planet-splat.png');
            this.load.image('satellite', 'assets/images/food-satellite.png');
            this.load.image('satellite-splat', 'assets/images/food-satellite-splat.png');
            this.load.image('star', 'assets/images/food-sun.png');
            this.load.image('star-splat', 'assets/images/food-sun-splat.png');

            this.load.image('grump-happy', 'assets/images/grump-happy.png');
            this.load.image('grump-medium', 'assets/images/grump-medium.png');
            this.load.image('grump-angry', 'assets/images/grump-angry.png');
            this.load.image('food-meter-under', 'assets/images/foodmeter-under.png');
            this.load.image('food-meter-fork', 'assets/images/foodmeter-fork.png');
            this.load.image('food-meter-bar', 'assets/images/foodmeter-green.png');
            this.load.image('clock', 'assets/images/clock.png');

            this.load.audio('music', 'assets/sounds/music.mp3');
            this.load.audio('splat', 'assets/sounds/splat.mp3');
            this.load.audio('woosh', 'assets/sounds/woosh.mp3');
            this.load.audio('tick-tock', 'assets/sounds/tick-tock.mp3');

            WebFont.load(<WebFont.Config>{
                google: {
                    families: ['Montserrat', 'Righteous']
                }
            });
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
