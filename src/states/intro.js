import Phaser from 'phaser'
import config from '../config'
import { writeBmpAsciArt, launchGreenEnemy } from '../utils.js';

export default class extends Phaser.State {
    create() {
        let me = this;
        //  The scrolling starfield background
        me.game.starfield = me.game.add.tileSprite(0, 0, 900, 600, 'starfield');
        me.fireButton = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        var codrefArray = [
            'XXXXX XXXXX     X XXXXX XXXXX XXXXX',
            'X     X   X     X X     X   X X',
            'X     X   X XXXXX X     XXXXX XXX',
            'X     X   X X   X X     X     X',
            'XXXXX XXXXX XXXXX X     XXXXX X',
        ];
        me.game.codref = writeBmpAsciArt(me.game, codrefArray, config.LOGO_WIDTH, config.LOGO_WIDTH, '#ffffff', 'auto', -50, -20, 0);
        var starArray = [
            '  X',
            'X X X',
            ' XXX',
            'X X X',
            '  X',
        ];
        me.game.star = writeBmpAsciArt(me.game, starArray, config.LOGO_WIDTH / 1.5, config.LOGO_WIDTH / 1.5, '#eb2326', me.game.codref.width + config.LOGO_WIDTH + me.game.codref.x, me.game.codref.y - config.LOGO_WIDTH / 1.5, 0, -10);
        
        //  Click to start
        me.introText = me.game.add.retroFont('atascii', 8, 8, Phaser.RetroFont.TEXT_SET1, null, null, null, null, 16);
        me.introText.text = 'CLICK TO START';
        var i = me.game.add.image(me.game.world.width/2, me.game.world.height/2 + 50, me.introText)
        i.scale.setTo(2,2);
        i.anchor.set(0.5);
        i.alpha = 0.1;
        me.game.add.tween(i).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
    update() {
        let me = this;
        //  Scroll the background
        me.game.starfield.tilePosition.y += 2;
        
        //  Start Game
        if (me.fireButton.isDown || me.game.input.activePointer.isDown) {
            me.introText.destroy();
            me.state.start('Play', false, false);
        }
     
    }    
}