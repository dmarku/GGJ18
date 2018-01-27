// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';
import InputPair from './Scripts/InputController';
import Actor from './Scripts/Actors/Actor';
import Player from './Scripts/Actors/Player';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var gameController = new GameController();

// --- Controls ---
let cursorKeys;

// --- Functions ---
function preload() 
{
    game.load.image('galaxie', 'Assets/galaxy_general.png');
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
}

function create () 
{
    // --- Init Player ---
    // -- Sprite Setup --
    game.add.sprite(0, 0, 'galaxie');
    var player_sprite = game.add.sprite(0, 0, 'player');

    // -- Player Input --
    var playerInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

    // -- Create Player Instance --
    var player = new Player(player_sprite, 0.1, playerInput, game);
    player.transform.position.setTo(640, 360);
    gameController.RegisterPlayer(player);
}

function update () 
{
    gameController.Update();
}

function UpdateScan()
{
    let {range, angle} = cones.current();

    playerScanCone.clear();
    playerScanCone.beginFill(0x202020);
    playerScanCone.arc(0, 0, range, 0.5 * angle / 180 * Math.PI, -0.5 * angle / 180 * Math.PI, true);
    playerScanCone.endFill();
}

