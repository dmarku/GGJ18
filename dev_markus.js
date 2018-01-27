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

let playerForwardInput;
let playerForwardSpeed = 3;
let playerBackwardSpeed = -1.5;

let coneRange = 200;
let coneAngle = 45;

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

    playerForwardInput = new InputPair(game, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);
}

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

    gameController.Update();

    playerScanCone.clear();
    playerScanCone.beginFill(0x202020);
    playerScanCone.arc(0, 0, coneRange, 0.5 * coneAngle / 180 * Math.PI, -0.5 * coneAngle / 180 * Math.PI, true);
    playerScanCone.endFill();
}