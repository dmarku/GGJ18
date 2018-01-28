
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

        this.game.physics.arcade.overlap(this.player.scanCone, this.goal.sprite, (player, goalSprite) => 
            {
                this.GoalPinged(this.player, this.goal);
            });
    }

    EnemyPinged(player, enemy)
    {
        let distance = this.game.physics.arcade.distanceToXY(player.transform, enemy.sprite.x, enemy.sprite.y);
        let conRangeLevel = 3;
        
        let direction = (Math.atan2(enemy.sprite.y - player.transform.y, enemy.sprite.x - player.transform.x) * 180 / Math.PI);
        direction += 180;
        let angle = (player.transform.worldRotation * 180) / Math.PI;
        angle += 180;
        let sightAngle = Math.abs(direction - angle);
        // console.log(sightAngle);
            
        if(sightAngle <= player.cones.current().angle)
        {
            for(let conesLevel of player.conesLevels) 
            {
                if(distance < conesLevel)
                {
                    conRangeLevel -= 1;
                }
            }
    
            enemy.UpdateVisibility(conRangeLevel);
        }
    }

    GoalPinged(player, goal)
    {
        let distance = this.game.physics.arcade.distanceToXY(player.transform, goal.transform.x, goal.transform.y);
        let conRangeLevel = 3;
        
        let direction = (Math.atan2(goal.transform.y - player.transform.y, goal.transform.x - player.transform.x) * 180 / Math.PI);
        direction += 180;
        let angle = (player.transform.worldRotation * 180) / Math.PI;
        angle += 180;
        let sightAngle = Math.abs(direction - angle);
        
        console.log(player.transform.x);
            
        if(sightAngle <= player.cones.current().angle)
        {
            for(let conesLevel of player.conesLevels) 
            {
                if(distance < conesLevel)
                {
                    conRangeLevel -= 1;
                }
            }
    
            goal.UpdateVisibility(conRangeLevel);
        }
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