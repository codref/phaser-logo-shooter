import Phaser from 'phaser'


export default class extends Phaser.State {

  create () {
    // game.scale.setGameSize(900, 400);
    this.state.start('Load');
  }

}