// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var gameController = new GameController();

function preload () 
{
    game.load.image('galaxie', 'Assets/galaxy_general.png');

    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
    game.load.spritesheet('goal', 'Assets/goal_01.png', 512, 512, 8);
    game.load.spritesheet('enemy', 'Assets/enemy_a_01.png', 512, 512, 8);
}

let player;
let playerSprite;
let playerScanCone;

let goal;

let playerForwardInput;
let playerForwardSpeed = 3;
let playerBackwardSpeed = -1.5;

class Cycle {
    // initialize this with a list of { range, angle } objects
    constructor(variants, initialIndex) {
        this.variants = variants;
        this.currentIndex = initialIndex || 0;
    }

    current () {
        return this.variants[this.currentIndex];
    }

    next () {
        this.currentIndex++;
        if (this.currentIndex > this.variants.length - 1) this.currentIndex = 0;

        return this.current();
    }

    previous () {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.variants.length - 1;

        return this.current();
    }
}

let cones = new Cycle([
    {range: 500, angle: 5},
    {range: 300, angle: 45},
    {range: 150, angle: 120},
], 1);

let enemies = [
    {x: 640, y: 360}
];

let cursorKeys;

class InputPair {
    constructor(game, positiveKey, negativeKey) {
        this.game = game;

        this.positiveKey = positiveKey;
        this.negativeKey = negativeKey;

        this.direction = 0;
    }

    update () {
        this.direction = 0;
        if (this.game.input.keyboard.isDown(this.positiveKey)) {
            this.direction += 1;
        }

        if (this.game.input.keyboard.isDown(this.negativeKey)) {
            this.direction -= 1;
        }
    }

    isPositive () {
        return this.direction > 0;
    }

    isNegative () {
        return this.direction < 0;
    }
}

let enemySprites;

function create () 
{
    game.add.sprite(0, 0, 'galaxie');

    enemySprites = enemies.map(enemy => {
        let sprite = game.add.sprite(enemy.x, enemy.y, 'enemy');
        sprite.anchor.setTo(0.5);

        sprite.scale.setTo(0.2);
        sprite.animations.add('idle');
        sprite.animations.play('idle', 8, true);

        sprite.alpha = 0.5;

        game.physics.enable(sprite, Phaser.Physics.ARCADE);

        return sprite;
    });

    player = game.add.group();
    player.position.setTo(50, 600);

    playerSprite = game.make.sprite(0, 0, 'player');
    playerSprite.scale.setTo(0.2);
    playerSprite.anchor.setTo(0.5);
    playerSprite.angle = -90;

    playerSprite.animations.add('idle');
    playerSprite.animations.play('idle', 8, true);

    player.addChild(playerSprite);

    playerScanCone = game.make.graphics(0, 0)

    game.physics.enable(playerScanCone, Phaser.Physics.ARCADE);
    let { range } = cones.current();
    playerScanCone.body.setCircle(range, -range, -range);
    player.addChild(playerScanCone);

    player.bringToTop(playerSprite);

    cursorKeys = game.input.keyboard.createCursorKeys();

    playerForwardInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

    let conesNextKey = game.input.keyboard.addKey(Phaser.Keyboard.F),
        conesPrevKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

    conesNextKey.onDown.add(() => cones.next());
    conesPrevKey.onDown.add(() => cones.previous());

    let scanKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    scanKey.onDown.add(() => scan());

    goal = game.add.sprite(900, 150, 'goal');
    goal.scale.setTo(0.2);
    goal.anchor.setTo(0.5);

    goal.animations.add('idle');
    goal.animations.play('idle', 8, true);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable([playerSprite, goal], Phaser.Physics.ARCADE);

    playerSprite.body.setCircle(210);

    goal.body.setCircle(150);
    goal.body.immovable = true;
}

function scan () {
    game.physics.arcade.overlap(playerScanCone, enemySprites, (player, enemy) => {
        /*
        let distancevector = Phaser.Point.subtract(player.position, enemy.position);
        let direction = Phaser.Point.rotate(new Phaser.Point(1, 0), 0, 0, player.rotation);
        let angleDifference = direction.angle(distancevector, true);

        let { angle } = cones.current();
        let inCone = Math.abs(angleDifference) < 0.5 * angle;

        if (inCone) {
            */
            pinged(player, enemy);
            /*
        }
        */
    });
    //pinged(player, enemySprites[0]);
}

function pinged (player, enemy) {
    let blip = game.add.graphics(enemy.x, enemy.y);

    blip.anchor.setTo(0.5);

    blip.clear();
    blip.beginFill(0xffffff, 0.4);
    blip.drawCircle(0, 0, 50);
    blip.endFill();
}

let foundGoal = false;

function update () 
{
    playerForwardInput.update();
    if (cursorKeys.left.isDown) {
        player.angle -= 5;
    }

    if (cursorKeys.right.isDown) {
        player.angle += 5;
    }

    if (playerForwardInput.isPositive()) {
        player.position.add(
            playerForwardSpeed * Math.cos(player.rotation),
            playerForwardSpeed * Math.sin(player.rotation));
    }

    if (playerForwardInput.isNegative()) {
        player.position.add(
            playerBackwardSpeed * Math.cos(player.rotation),
            playerBackwardSpeed * Math.sin(player.rotation));
    }

    let {range, angle} = cones.current();

    playerScanCone.body.setCircle(range, -range, -range);

    playerScanCone.clear();
    playerScanCone.lineStyle(2, 0x00c000, 0.4);
    playerScanCone.beginFill(0x00ff00, 0.1);
    playerScanCone.arc(0, 0, range, 0.5 * angle / 180 * Math.PI, -0.5 * angle / 180 * Math.PI, true);
    playerScanCone.endFill();

    game.physics.arcade.overlap(playerSprite, goal, () => {
        if (!foundGoal) {
            foundGoal = true;
            alert('You won!');
        }
    }, null, this);
}

function collisionHandler ()
{
    console.log('collision!');
}