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

let player;
let playerSprite;
let playerScanCone;

let playerForwardSpeed = 3;
let playerBackwardSpeed = -1.5;

let cursorKeys;

function create () 
{
    player = game.add.group();
    player.position.setTo(640, 360);

    playerSprite = game.make.sprite(0, 0, 'player');
    playerSprite.scale.setTo(0.1, 0.1);
    playerSprite.anchor.setTo(0.5);
    playerSprite.angle = -90;
    player.addChild(playerSprite);

    playerScanCone = game.make.graphics(0, 0)
    player.addChild(playerScanCone);

    player.bringToTop(playerSprite);

    cursorKeys = game.input.keyboard.createCursorKeys();
}

function update () 
{
    if (cursorKeys.left.isDown) {
        player.angle -= 5;
    }

    if (cursorKeys.right.isDown) {
        player.angle += 5;
    }

    if (cursorKeys.up.isDown) {
        player.position.add(
            playerForwardSpeed * -Math.sin(player.rotation),
            playerForwardSpeed * Math.cos(player.rotation));
    }

    if (cursorKeys.down.isDown) {
        player.position.add(
            playerBackwardSpeed * -Math.sin(player.rotation),
            playerBackwardSpeed * Math.cos(player.rotation));
    }

    gameController.Update();

    playerScanCone.clear();
    playerScanCone.beginFill(0x202020);
    playerScanCone.arc(0, 0, 200, 15 / 180 * Math.PI, -15 / 180 * Math.PI, true);
    playerScanCone.endFill();
}