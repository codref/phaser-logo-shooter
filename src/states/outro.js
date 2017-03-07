import Phaser from 'phaser'
import config from '../config'
import { writeBmpAsciArt, launchGreenEnemy } from '../utils.js';

export default class extends Phaser.State {
    init(score) {
        let me = this;
        me.playerScore = score;
    }
    create() {
        let me = this;
        me.fireButton = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Game over
        me.introText = me.game.add.retroFont('atascii', 8, 8, Phaser.RetroFont.TEXT_SET1, null, null, null, null, 16);
        me.introText.text = 'GAME OVER';
        var i = me.game.add.image(me.game.world.width/2, me.game.world.height/2, me.introText)
        i.scale.setTo(6,6);
        i.anchor.set(0.5);
        i.alpha = 0.1;
        me.game.add.tween(i).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  Player Score
        var score = me.game.add.retroFont('atascii', 8, 8, Phaser.RetroFont.TEXT_SET1, null, null, null, null, 16);
        me.scoreText = me.game.add.image(me.game.world.width / 2, me.game.world.height/2 + 50, score)
        me.scoreText.anchor.set(0.5);
        me.scoreText.scale.setTo(2,2);
        score.text = 'Your Score is ' + me.playerScore;
        me.game.time.events.loop(Phaser.Timer.SECOND * 2, me.randomScoreColor, me);

        me.game.codref.destroy();
        me.game.star.destroy();
    }
    update() {
        let me = this;
        //  Scroll the background
        me.game.starfield.tilePosition.y += 2;
        
        //  Start Game
        if (me.fireButton.isDown || me.game.input.activePointer.isDown) {
            me.introText.destroy();
            me.state.start('Intro', false, false);
        }
     
    }
    randomScoreColor () {
        let me = this;
        me.scoreText.tint = Math.random() * 0xFFFFFF;
    }    
}