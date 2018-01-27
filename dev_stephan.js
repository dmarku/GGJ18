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
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
    game.load.spritesheet('goal', 'Assets/goal_01.png', 512, 512, 8);
    game.load.spritesheet('enemy', 'Assets/enemy_a_01.png', 512, 512, 8);

    // -- Insert Stephan --
    game.load.image('galaxie', 'Assets/galaxy_general.png');
    game.load.image('fog', 'Assets/fog_01.png');
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
    }

    previous () {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.variants.length - 1;
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
let fogSpriteEnemy;
let fogSpriteGoal;

function create () 
{
    // -- Insert Stephan --
    // --- Init Background ---
    game.add.sprite(0, 0, 'galaxie');

    enemySprites = enemies.map(enemy => {
        let sprite = game.add.sprite(enemy.x, enemy.y, 'enemy');
        sprite.scale.setTo(0.2);
        sprite.animations.add('idle');
        sprite.animations.play('idle', 8, true);
        sprite.alpha = 0; // <---
        return sprite;
    });

    player = game.add.group();
    player.position.setTo(50, 600);

    playerSprite = game.make.sprite(0, 0, 'player');
    playerSprite.scale.setTo(0.2);
    playerSprite.anchor.setTo(0.5);
    playerSprite.angle = -90;
    player.addChild(playerSprite);

    playerScanCone = game.make.graphics(0, 0)
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
    goal.alpha = 0;

    // -- Insert Stephan --
    fogSpriteEnemy = game.add.sprite(enemies[0].x, enemies[0].y, 'fog');
    fogSpriteEnemy.anchor.setTo(0.5);
    fogSpriteEnemy.visible = false;
    fogSpriteGoal = game.add.sprite(900, 150, 'fog');
    fogSpriteGoal.anchor.setTo(0.5);
    fogSpriteGoal.visible = false;
}

function scan () {

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

    playerScanCone.clear();
    playerScanCone.lineStyle(2, 0x00c000, 0.4);
    playerScanCone.beginFill(0x00ff00, 0.1);
    playerScanCone.arc(0, 0, range, 0.5 * angle / 180 * Math.PI, -0.5 * angle / 180 * Math.PI, true);
    playerScanCone.endFill();

    game.physics.arcade.overlap(playerSprite, goal, () => {
        SetGoalVisibility(goal, 150, 1);
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

function render ()
{
    //game.debug.body(playerSprite);
    //game.debug.body(goal);
}

// -- --
function SetEnemyVisibility(enemy, distance, direction)
{
    SetVisibility(fogSpriteEnemy, enemy, distance, direction);
}

function SetGoalVisibility(goal, distance, direction)
{
    SetVisibility(fogSpriteGoal, goal, distance, direction);
}

function SetVisibility(obj, target, distance, direction)
{
    if(!obj.visible)
    {
        obj.visible = true;
        obj.alpha = 1.0;
    }
    else if(obj.alpha > 0)
    {
        obj.alpha -= distance / 500;
        target.aplha += distance / 500;
        console.log(obj.alpha);
    }
}