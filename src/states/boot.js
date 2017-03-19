import Phaser from 'phaser'


export default class extends Phaser.State {

  create () {
    // game.scale.setGameSize(900, 400);
    this.stage.disableVisibilityChange = true;
    this.state.start('Load');
  }

}