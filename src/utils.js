export function writeBmpAsciArt(game, asciiArtArray, blockWidth, blockHeight, fillStyle, x, y, damageAmount, healingAmount) {
    var bmpObject;
    var groupedObject;
    bmpObject = game.add.bitmapData(blockWidth, blockHeight);
    bmpObject.ctx.fillStyle = fillStyle;
    bmpObject.ctx.fillRect(0, 0, blockWidth, blockHeight);

    groupedObject = game.add.group();
    groupedObject.enableBody = true;
    groupedObject.physicsBodyType = Phaser.Physics.ARCADE;

    for (var j = 0, rows = asciiArtArray.length; j < rows; j++) {
        for (var i = 0, cols = asciiArtArray[j].length; i < cols; i++) {
            if (asciiArtArray[j][i] === 'X') {
                var k = groupedObject.create(i * blockWidth, j * blockHeight, bmpObject);
                k.damageAmount = damageAmount;
                k.healingAmount = healingAmount;
            }
        }
    }
    if (x === 'auto' || x < 0) {
        groupedObject.x = (game.width / 2) - (groupedObject.width / 2);
        if (x < 0) {
            groupedObject.x += x;
        }
    } else {
        groupedObject.x = x;
    }
    if (y === 'auto' || y < 0) {
        groupedObject.y = (game.height / 2) - (groupedObject.height / 2);
        if (y < 0) {
            groupedObject.y += y;
        }
    } else {
        groupedObject.y = y;
    }
    return groupedObject;
}

export function launchGreenEnemy(game, greenEnemies) {
    var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var enemy = greenEnemies.getFirstExists(false);

    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;
    }

    //  Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGreenEnemy);
}