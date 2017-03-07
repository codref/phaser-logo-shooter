import Phaser from 'phaser'
export default class extends Phaser.State {

    preload () {
        this.load.image('starfield', 'assets/images/starfield.png');
        this.load.image('ship', 'assets/images/player-star.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('trail', 'assets/images/trail.png');
        this.load.image('enemy-green', 'assets/images/green.png');
        this.load.spritesheet('explosion', 'assets/images/explode.png', 128, 128);
        this.load.image('atascii', 'assets/fonts/atascii-ATASCII.png');
    }
    create () {
        this.state.start('Intro');
    }
}