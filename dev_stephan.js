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

let enemyData = [
    {x: 640, y: 360}
];

function create() 
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

    // -- Player Input --
    var playerInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
    let scanKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    scanKey.onDown.add(() => gameController.scan());

    // -- Create Player Instance --
    var player = new Player(player_sprite, 0.2, playerInput, game);
    player.transform.position.setTo(500, 100);
    gameController.RegisterPlayer(player);

    // --- Init Goal ---
    var goal_sprite = game.add.sprite(0,0, 'goal');
    var goal = new Goal(goal_sprite, 0.2, game);
    goal.transform.position.setTo(700, 100);
    gameController.RegisterGoal(goal);

    // --- Init Enemies ---
    let enemies = enemyData.map(enemy => {
        let sprite = game.make.sprite(0, 0, 'enemy');
        return new Enemy(sprite, 0.2, game);
    });

    enemies.forEach(e => {
        e.sprite.body.setCircle(200);
        gameController.RegisterEnemy(e);
    });

    // --- Start Physics ---
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

function update() 
{
    gameController.Update();
    game.physics.arcade.overlap(gameController.player.transform, gameController.goal.transform, () => {
        if (!foundGoal) {
            foundGoal = true;
            alert('You won!');
        }
    }, null, this);
}

function render ()
{
    game.debug.body(gameController.player.sprite);
    game.debug.body(gameController.goal.sprite);
    game.debug.body(gameController.player.scanCone);
    for (let e of gameController.enemies) {
        game.debug.body(e.sprite);
    }
}