import Phaser from 'phaser'

import BootState from './states/boot'
import LoadState from './states/load'
import PlayState from './states/play'
import IntroState from './states/intro'
import OutroState from './states/outro'

import config from './config'

class Game extends Phaser.Game {

  constructor() {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Load', LoadState, false)
    this.state.add('Intro', IntroState, false)
    this.state.add('Play', PlayState, false)
    this.state.add('Outro', OutroState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()