// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';
import Actor from './Scripts/Actors/Actor';
import Player from './Scripts/Actors/Player';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var gameController = new GameController();

function preload() 
{
    game.load.image('galaxie', 'Assets/galaxy_general.png');
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
}

function create () 
{
    game.add.sprite(0, 0, 'galaxie');
    var player_sprite = game.add.sprite(0, 0, 'player');
    var player = new Player(player_sprite);
    
    gameController.RegisterPlayer(player);
}

function update () 
{
    gameController.Update();
}