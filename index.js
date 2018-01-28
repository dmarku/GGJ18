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
var winscreen = null;
var losescreen = null;
var credtisscreen = null;

let foundGoal = false;
let playerDead = false;

// --- Controls ---

// --- Functions ---
function preload() 
{
    game.load.spritesheet('galaxie', 'Assets/galaxy_anim_01.png', 1280, 720);
    game.load.spritesheet('winscreen', 'Assets/win_screen_01.png', 1280, 720);
    game.load.spritesheet('losescreen', 'Assets/game_over_screen_01.png', 1280, 720);
    game.load.spritesheet('credtisscreen', 'Assets/credit_screen_01.png', 1280, 720);
    game.load.image('creditsexit', 'Assets/credit_screen_EXIT_01.png', 92, 98);
    game.load.image('creditsbutton', 'Assets/overlay_credit-button_01.png', 78, 73);
    
    game.load.spritesheet('player', 'Assets/player_01.png', 512, 512);
    game.load.spritesheet('goal', 'Assets/goal_01.png', 512, 512, 8);

    game.load.spritesheet('enemy', 'Assets/enemy_a_01.png', 512, 512, 8);
    game.load.spritesheet('fog', 'Assets/fog_01.png', 512, 512);
    game.load.image('hud', 'Assets/overlay_01.png', 1280, 720);

    game.load.audio('bg_music', 'Assets/audio/Space_Station_Experience.mp3');
    game.load.audio('scan', 'Assets/audio/waves_01.ogg');
    game.load.audio('shot', 'Assets/audio/shot_01.ogg');
}

let playerData = {x: 100, y: 360};

let goalData = {
    x: Math.random() * 700 + 400,
    y: Math.random() * 600 + 60
};

let enemycount = 20;

let enemyData = [];
for (let i = 0; i < enemycount; i++) {
    enemyData.push({
        x: Math.random() * 1000 + 140,
        y: Math.random() * 600 + 60
    });
}

let hud;
let lifebar;
let enemyVisibleCount;
let enemyCount;
let creditsButton;
let creditsexitButton;
let restartButton;

function create() 
{
    let scanSound = this.game.add.sound('scan');
    let shotSound = this.game.add.sound('shot');

    gameController.scanSound = scanSound;
    gameController.shotSound = shotSound;

    // --- Start Physics ---
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // --- Init Background ---
    var galaxy = game.add.sprite(0, 0, 'galaxie');
    galaxy.animations.add('idle');
    galaxy.animations.play('idle', 3, true);

    // -- Play Music --
    var music = game.add.audio('bg_music', 0.5);
    music.loopFull();

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
    player.transform.position.setTo(playerData.x, playerData.y);
    gameController.RegisterPlayer(player);

    // --- Init Goal ---
    var goal_sprite = game.add.sprite(0,0, 'goal');
    var goal = new Goal(goal_sprite, 0.2, game, game.add.sprite(0, 0, 'fog'));
    goal.transform.position.setTo(goalData.x, goalData.y);
    gameController.RegisterGoal(goal);

    // --- Init Enemies ---
    let enemies = enemyData.map(({x, y}) => {
        let sprite = game.add.sprite(x, y, 'enemy');
        let fog = game.add.sprite(x, y, 'fog');
        let circle = game.make.graphics(x, y);
        let tween = game.add.tween(circle.scale);
        tween.to({x: 1, y: 1}, 5000, 'Linear', false);
        return new Enemy(sprite, 0.2, game, fog, circle, tween);
    });

    enemies.forEach(e => {
        gameController.RegisterEnemy(e);
    });

    // --- Start Physics ---
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // --- HUD ---
    hud = game.add.sprite(0, 0, 'hud');

    //let lifebar;
    //let enemyVisibleCount;
    //let enemyCount;

    lifebar = game.add.text(
        180, game.height - 75, 
        "100", 
        {
        font: "55px Arial",
        fill: "#ffffff",
        align: "center"
    });

    lifebar.anchor.setTo(1, 0.5);

    enemyVisibleCount = game.add.text(
        game.width - 225, game.height - 110, 
        0, 
        {
        font: "55px Arial",
        fill: "#ffffff",
        align: "center"
    });
    
    enemyCount = game.add.text(
        game.width - 125, game.height - 100, 
        enemyData.length, 
        {
        font: "55px Arial",
        fill: "#ffffff",
        align: "center"
    });

    creditsButton = game.add.button(game.world.centerX - 38, game.height +2, 'creditsbutton', showCredtisscreen, this, 20, 20, 0);
    creditsButton.anchor.setTo(0, 1);

    credtisscreen = game.add.sprite(0, 0, 'credtisscreen');
    creditsexitButton = game.add.button(game.width - 100, 10, 'creditsexit', hideCreditsscreen, this, 20, 20, 0);

    credtisscreen.visible = false;
    creditsexitButton.visible = false;

    gameController.RegisterUI(lifebar, enemyVisibleCount, enemyCount);
}


function update() 
{
    if (!playerDead && gameController.player.health <= 0) {
        playerDead = true;
        showLosescreen();
        //alert("You have lost all your health. Game Over. D:");
    }

    if(foundGoal || playerDead)
        return;

    gameController.Update();

    game.physics.arcade.overlap(gameController.player.sprite, gameController.goal.sprite, () => {
        if(!foundGoal) 
        {
            foundGoal = true;
            showWinscreen();
        }
    }, null, this);
}

function showWinscreen()
{
    winscreen = game.add.sprite(0, 0, 'winscreen');
    winscreen.animations.add('idle');
    winscreen.animations.play('idle', 2, true);
    game.world.bringToTop(winscreen);
}

function showLosescreen()
{
    losescreen = game.add.sprite(0, 0, 'losescreen');
    losescreen.animations.add('idle');
    losescreen.animations.play('idle', 2, true);
    game.world.bringToTop(losescreen);
}

function showCredtisscreen()
{
    credtisscreen.visible = true;
    creditsexitButton.visible = true;
    game.world.bringToTop(credtisscreen);
    game.world.bringToTop(creditsexitButton);
}

function hideCreditsscreen()
{
    credtisscreen.visible = false;
    creditsexitButton.visible = false;
}

function render()
{
    //game.debug.body(gameController.player.sprite);
    //game.debug.body(gameController.goal.sprite);
    /*
    for (let enemy of gameController.enemies) {
        game.debug.body(enemy.sprite, '#ff000080');
    }
    */
}