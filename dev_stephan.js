// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var gameController = new GameController();

function preload () 
{
    
}

function create () 
{

}

function update () 
{
    gameController.Update();
}