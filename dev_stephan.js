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

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var gameController = new GameController();

// --- Controls ---

// --- Functions ---
function preload() 
{
    game.load.image('galaxie', 'Assets/galaxy_general.png');
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
    game.load.spritesheet('goal', 'Assets/goal_01.png', 512, 512, 8);
}

function create() 
{
    // --- Init Background ---
    game.add.sprite(0, 0, 'galaxie');

    // --- Init Player ---
    // -- Sprite Setup --
    var player_sprite = game.add.sprite(0, 0, 'player');

    // -- Player Input --
    var playerInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

    // -- Create Player Instance --
    var player = new Player(player_sprite, 0.2, playerInput, game);
    player.transform.position.setTo(100, 100);
    gameController.RegisterPlayer(player);

    // --- Init Goal ---
    var goal_sprite = game.add.sprite(0,0, 'goal');
    var goal = new Goal(goal_sprite, 0.2, game);
    goal.transform.position.setTo(640, 360);
    gameController.RegisterGoal(goal);

    // --- Start Physics ---
    game.physics.enable([player.transform, goal.transform], Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

function update() 
{
    gameController.Update();
    game.physics.arcade.overlap(gameController.player.transform, gameController.goal.transform, collisionHandler, null, this);
}

function collisionHandler()
{
    console.log('collision!');
}

function render()
{
    game.debug.body(gameController.player.sprite);
    //game.debug.body(goal);
}