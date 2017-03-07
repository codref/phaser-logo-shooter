import Phaser from 'phaser'
import config from '../config'
import { writeBmpAsciArt, launchGreenEnemy } from '../utils.js';

export default class extends Phaser.State {
    create() {
        let me = this;

        //  Our bullet group
        me.bulletTimer = 0;
        me.bullets = me.game.add.group();
        me.bullets.enableBody = true;
        me.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        me.bullets.createMultiple(30, 'bullet');
        me.bullets.setAll('anchor.x', 0.5);
        me.bullets.setAll('anchor.y', 1);
        me.bullets.setAll('outOfBoundsKill', true);
        me.bullets.setAll('checkWorldBounds', true);

        //  The hero!
        me.player = me.game.add.sprite(400, 400, 'ship');
        me.player.anchor.setTo(0.5, 0.5);
        me.player.health = 100;
        me.player.score = 0;
        me.physics.enable(me.player, Phaser.Physics.ARCADE);
        me.player.body.maxVelocity.setTo(config.MAXSPEED, config.MAXSPEED);
        me.player.body.drag.setTo(config.DRAG, config.DRAG);
        me.player.events.onKilled.add(function () {
            me.shipTrail.kill();
        });

        //  The baddies!
        me.greenEnemies = me.game.add.group();
        me.greenEnemies.enableBody = true;
        me.greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        me.greenEnemies.createMultiple(5, 'enemy-green');
        me.greenEnemies.setAll('anchor.x', 0.5);
        me.greenEnemies.setAll('anchor.y', 0.5);
        me.greenEnemies.setAll('scale.x', 0.5);
        me.greenEnemies.setAll('scale.y', 0.5);
        me.greenEnemies.setAll('angle', 180);
        me.greenEnemies.setAll('outOfBoundsKill', true);
        me.greenEnemies.setAll('checkWorldBounds', true);
        me.greenEnemies.forEach(function (enemy) {
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.damageAmount = 20;
        });

        me.launchGreenEnemy();

        //  And some controls to play the game with
        me.cursors = me.game.input.keyboard.createCursorKeys();
        me.fireButton = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Add an emitter for the ship's trail
        me.shipTrail = this.game.add.emitter(this.player.x, this.player.y + 20, 400);
        me.shipTrail.width = 60;
        me.shipTrail.makeParticles('trail');
        me.shipTrail.setXSpeed(30, -30);
        me.shipTrail.setYSpeed(200, 180);
        me.shipTrail.setRotation(50, -50);
        me.shipTrail.setAlpha(1, 0.01, 800);
        me.shipTrail.setScale(0.2, 0.8, 0.2, 0.8, 2000, Phaser.Easing.Quintic.Out);
        me.shipTrail.start(false, 5000, 10);

        //  An explosion pool
        me.explosions = me.game.add.group();
        me.explosions.enableBody = true;
        me.explosions.physicsBodyType = Phaser.Physics.ARCADE;
        me.explosions.createMultiple(30, 'explosion');
        me.explosions.setAll('anchor.x', 0.5);
        me.explosions.setAll('anchor.y', 0.5);
        me.explosions.forEach(function (explosion) {
            explosion.animations.add('explosion');
        });

        //  Shields stat
        me.shields = me.game.add.retroFont('atascii', 8, 8, Phaser.RetroFont.TEXT_SET1, null, null, null, null, 16);
        me.game.add.image(me.game.world.width - 260, 30, me.shields).scale.setTo(2,2);
        me.shields.text = 'Shields: ' + me.player.health + '%';
        me.shields.render = function () {
            me.shields.text = 'Shields: ' + Math.max(me.player.health, 0) + '%';
        };

        //  Player Score
        me.score = me.game.add.retroFont('atascii', 8, 8, Phaser.RetroFont.TEXT_SET1, null, null, null, null, 16);
        var s = me.game.add.image(me.game.world.width - 260, 50, me.score)
        s.scale.setTo(2,2);
        me.score.text = 'Score: ' + me.player.score;
        me.score.render = function () {
            if (me.player.score < 0) {
                s.tint = 0xeb2326;
            } else {
                s.tint = 0xffffff;
            }
            me.score.text = 'Score: ' + me.player.score;
        };        
    }

    update() {
        let me = this;
        //  Scroll the background
        me.game.starfield.tilePosition.y += 2;

        //  Reset the player, then check for movement keys
        me.player.body.acceleration.x = 0;

        if (me.cursors.left.isDown) {
            me.player.body.acceleration.x = -config.ACCLERATION;
        } else if (me.cursors.right.isDown) {
            me.player.body.acceleration.x = config.ACCLERATION;
        }

        //  Stop at screen edges
        if (me.player.x > me.game.width - 50) {
            me.player.x = me.game.width - 50;
            me.player.body.acceleration.x = 0;
        }
        if (me.player.x < 50) {
            me.player.x = 50;
            me.player.body.acceleration.x = 0;
        }

        //  Fire bullet
        if (me.player.alive && (me.fireButton.isDown || me.game.input.activePointer.isDown)) {
            me.fireBullet();
        }

        //  Move ship towards mouse pointer
        if (this.game.input.x < this.game.width - 20 &&
            this.game.input.x > 20 &&
            this.game.input.y > 20 &&
            this.game.input.y < this.game.height - 20) {
            var minDist = 200;
            var dist = this.game.input.x - this.player.x;
            this.player.body.velocity.x = config.MAXSPEED * this.game.math.clamp(dist / minDist, -1, 1);
        }
        //  Squish and rotate ship for illusion of "banking"
        var bank = this.player.body.velocity.x / config.MAXSPEED;
        this.player.scale.x = 1 - Math.abs(bank) / 2;
        this.player.angle = bank * 10;

        //  Keep the shipTrail lined up with the ship
        this.shipTrail.x = this.player.x;

        //  Check collisions
        this.game.physics.arcade.overlap(me.player, me.greenEnemies, me.shipCollide, null, this);
        this.game.physics.arcade.overlap(this.greenEnemies, this.bullets, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(me.game.codref, this.bullets, this.hitEnemy, null, this);
        this.game.physics.arcade.overlap(me.game.star, this.bullets, this.hitEnemy, null, this);

        // Game over
        if (! me.player.alive) {
            me.state.start('Outro', false, false, me.player.score);
        }
    }

    launchGreenEnemy() {
        let me = this;
        var MIN_ENEMY_SPACING = 300;
        var MAX_ENEMY_SPACING = 3000;

        // speed is proportional to points
        var ENEMY_SPEED = 300 + Math.max(Math.floor(me.player.score / 1000) * 50, 0);

        var enemy = me.greenEnemies.getFirstExists(false);

        if (enemy) {
            enemy.reset(game.rnd.integerInRange(0, game.width), -20);
            enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;
        }

        //  Send another enemy soon
        game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), me.launchGreenEnemy.bind(this));
    }

    fireBullet() {
        let me = this;
        //  To avoid them being allowed to fire too fast we set a time limit
        if (me.game.time.now > me.bulletTimer) {
            //  Grab the first bullet we can from the pool
            var bullet = me.bullets.getFirstExists(false);
            if (bullet) {
                //  And fire it
                bullet.reset(me.player.x, me.player.y + 8);
                bullet.body.velocity.y = config.BULLET_SPEED;
                me.bulletTimer = me.time.now + config.BULLET_SPACING;
            }
        }
    }

    shipCollide(player, enemy) {
        let me = this;
        var explosion = me.explosions.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        enemy.kill();
        player.damage(enemy.damageAmount);
        me.shields.render();
    }

    hitEnemy(enemy, bullet) {
        let me = this;
        var explosion = me.explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        enemy.kill();
        bullet.kill();
        me.player.score += enemy.damageAmount * 10;
        if (typeof enemy.healingAmount !== 'undefined') {
            me.player.damage(enemy.healingAmount);
            me.shields.render();
        }
        me.score.render();
    }
}