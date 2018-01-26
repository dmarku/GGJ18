// fix global variables to make Phaser run
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

const Phaser = require('phaser-ce');

import GameController from './Scripts/GameController';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var gameController = new GameController();

function preload () 
{
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
}

let playerSprite;
let playerForwardSpeed = 3;
let playerBackwardSpeed = -1.5;
let cursorKeys;

function create () 
{
    playerSprite = game.add.sprite(640, 360, 'player');
    playerSprite.scale.setTo(0.1, 0.1);
    playerSprite.anchor.setTo(0.5);

    cursorKeys = game.input.keyboard.createCursorKeys();
}

function update () 
{
    if (cursorKeys.left.isDown) {
        playerSprite.angle -= 5;
    }

    if (cursorKeys.right.isDown) {
        playerSprite.angle += 5;
    }

    if (cursorKeys.up.isDown) {
        playerSprite.position.add(
            playerForwardSpeed * Math.cos(playerSprite.rotation),
            playerForwardSpeed * Math.sin(playerSprite.rotation));
    }

    if (cursorKeys.down.isDown) {
        playerSprite.position.add(
            playerBackwardSpeed * Math.cos(playerSprite.rotation),
            playerBackwardSpeed * Math.sin(playerSprite.rotation));
    }

    gameController.Update();
}