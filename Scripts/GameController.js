
export default class GameController 
{
    // 0 = Init
    // 1 = Start
    // 2 = Loop
    // 3 = GameOver

    constructor(_game) 
    {
        this.state = 0;
        this.player = null;
        this.enemies = [];
        this.goal = null;
        this.input = null;
        this.game = _game;
    }

    RegisterPlayer(_player)
    {
        this.player = _player;
    }

    RegisterEnemy(_enemy)
    {
        this.enemies.push(_enemy);
    }

    RegisterGoal(_goal)
    {
        this.goal = _goal;
    }

    RegisterInput(_input)
    {
        this.input = _input;
        this.cursorKeys = this.game.input.keyboard.createCursorKeys();
        this.scanKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.scanKey.onDown.add(() => this.Scan());
    }

    //#region GameSystem

    StartGame()
    {

    }

    Update()
    {
        this.UpdateInput();

        this.player.Update();
        for(let enemy of this.enemies) 
        {
            enemy.Update();
        }
    }

    Scan()
    {
        console.log("Scan");

        this.game.physics.arcade.overlap(this.player.scanCone, this.enemies, (player, enemy) => {
            /*
            let distancevector = Phaser.Point.subtract(player.position, enemy.position);
            let direction = Phaser.Point.rotate(new Phaser.Point(1, 0), 0, 0, player.rotation);
            let angleDifference = direction.angle(distancevector, true);

            let { angle } = cones.current();
            let inCone = Math.abs(angleDifference) < 0.5 * angle;

            if (inCone) {
                */
                enemyPinged(player, enemy);
                /*
            }
            */
        });
        //pinged(player, enemySprites[0]);
    }

    enemyPinged (player, enemy)
    {
        let blip = game.add.graphics(enemy.x, enemy.y);

        blip.anchor.setTo(0.5);

        blip.clear();
        blip.beginFill(0xffffff, 0.4);
        blip.drawCircle(0, 0, 50);
        blip.endFill();
    }

    UpdateInput()
    {
        this.input.update();
        let velocity = new Phaser.Point(0,0);


        
        

        if(this.cursorKeys.left.isDown) 
            velocity.x = -1;

        if(this.cursorKeys.right.isDown) 
            velocity.x = 1;

        velocity.y = this.input.direction;
        
        this.player.MoveBy(velocity);
    }

    //#endregion
}