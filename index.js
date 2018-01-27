// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';
import InputPair from './Scripts/InputController';
import Actor from './Scripts/Actors/Actor';
import Player from './Scripts/Actors/Player';
import Goal from './Scripts/Actors/Goal';
import Enemy from './Scripts/Actors/Enemy';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});
var gameController = new GameController(game);

// --- Controls ---

// --- Functions ---
function preload() 
{
    game.load.image('galaxie', 'Assets/galaxy_general.png');
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
    game.load.spritesheet('goal', 'Assets/goal_01.png', 512, 512, 8);

    game.load.spritesheet('enemy', 'Assets/enemy_a_01.png', 512, 512, 8);
}

let enemyData = [
    {x: 640, y: 360}
];

function create() 
{
    // --- Init Background ---
    game.add.sprite(0, 0, 'galaxie');

    // --- Init Player ---
    // -- Sprite Setup --
    var player_sprite = game.add.sprite(0, 0, 'player');

    // -- Player Input --
    var playerInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
    gameController.RegisterInput(playerInput);

    this.scanKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.scanKey.onDown.add(() => gameController.Scan());

    // -- Create Player Instance --
    var player = new Player(player_sprite, 0.2, game);
    player.transform.position.setTo(750, 100);
    gameController.RegisterPlayer(player);

    // --- Init Goal ---
    var goal_sprite = game.add.sprite(0,0, 'goal');
    var goal = new Goal(goal_sprite, 0.2, game);
    goal.transform.position.setTo(530, 100);
    gameController.RegisterGoal(goal);

    // --- Init Enemies ---
    let enemies = enemyData.map(enemy => {
        let sprite = game.add.sprite(enemy.x, enemy.y, 'enemy');
        return new Enemy(sprite, 0.2, game);
    });

    enemies.forEach(e => gameController.RegisterEnemy(e));

    // --- Start Physics ---
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

let foundGoal = false;

function update() 
{
    gameController.Update();

    game.physics.arcade.overlap(gameController.player.sprite, gameController.goal.sprite, () => {
        if (!foundGoal) {
            foundGoal = true;
            alert('You won!');
        }
    }, null, this);
}

function render()
{
    game.debug.body(gameController.player.sprite);
    game.debug.body(gameController.goal.sprite);
    game.debug.body(gameController.player.scanCone);
    for (let enemy of gameController.enemies) {
        game.debug.body(enemy.sprite);
    }
}