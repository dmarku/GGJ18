
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

        for(let enemy of this.enemies) 
        {
            this.game.physics.arcade.overlap(this.player.scanCone, enemy.sprite, (player, enemySprite) => 
            {
                this.EnemyPinged(this.player, enemy);
            });
        }
    }

    EnemyPinged(player, enemy)
    {
        let distance = this.game.physics.arcade.distanceToXY(player.transform, enemy.sprite.x, enemy.sprite.y);
        let conRangeLevel = 3;
        
        //let direction = (Math.atan2(enemy.transform.y - player.transform.y, enemy.transform.x - enemy.transform.x) * 180 / Math.PI);

        for(let enemyCone of player.conesLevels) 
        {
            if(distance < enemyCone)
            {
                conRangeLevel -= 1;
            }
        }

        enemy.UpdateVisibility(conRangeLevel);

        /*
        let distancevector = Phaser.Point.subtract(player.position, enemy.position);
        let direction = Phaser.Point.rotate(new Phaser.Point(1, 0), 0, 0, player.rotation);
        let angleDifference = direction.angle(distancevector, true);

        let { angle } = cones.current();
        let inCone = Math.abs(angleDifference) < 0.5 * angle;

        if(inCone) 
        {
            
        }
        */

        /*Phaser.Point.subtract(player.position, enemy.position);
        let blip = this.game.add.graphics(enemy.x, enemy.y);

        blip.anchor.setTo(0.5);
        blip.clear();
        blip.beginFill(0xffffff, 0.4);
        blip.drawCircle(0, 0, 50);
        blip.endFill();
        */
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