
export default class GameController 
{
    // 0 = Init
    // 1 = Start
    // 2 = Loop
    // 3 = GameOver

    constructor(_game) 
    {
        this.player = null;
        this.enemies = [];
        this.goal = null;
        this.input = null;
        this.game = _game;
        this.ui_lifebar = null;
        this.ui_enemyvisiblecount = null;
        this.ui_enemycount = null;
        this.enemyVisibleCount = 0;
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

    RegisterUI(_ui_lifebar, _ui_enemyvisiblecount, _ui_enemycount)
    {
        this.ui_lifebar = _ui_lifebar;
        this.ui_enemyvisiblecount = _ui_enemyvisiblecount;
        this.ui_enemycount = _ui_enemycount;
    }

    //#region GameSystem

    StartGame()
    {

    }

    Update()
    {
        this.UpdateInput();

        this.player.Update();
        this.enemyVisibleCount = 0;

        for(let enemy of this.enemies) 
        {
            enemy.Update();

            if(enemy.sprite.visible)
                this.enemyVisibleCount++; 
        }

        this.ui_enemyvisiblecount.setText(this.enemyVisibleCount);
    }

    Scan()
    {
        this.scanSound.play();
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
            
            let enemyStatus = enemy.sprite.visible;
            
            enemy.UpdateVisibility(conRangeLevel);

            // --- enemy launch behaviour ---
            if (distance < enemy.targetingRange) {
                let {x, y} = player.sprite.worldPosition;
                let radius = 150;
                let chargeTime = enemy.shockChargeTime;

                let shockArea = this.game.add.graphics(x, y);
                shockArea.anchor.setTo(0.5);
                this.game.physics.enable(shockArea, Phaser.Physics.ARCADE);

                shockArea.clear();
                shockArea.beginFill(0xff0000, 0.3);
                shockArea.drawCircle(0, 0, radius * 2);
                shockArea.endFill();

                shockArea.body.setCircle(radius, 0, 0);

                let crosshair = this.game.add.sprite(x, y, 'crosshair');
                crosshair.scale.setTo(0.5);
                crosshair.anchor.setTo(0.5);

                let chRotateTween = this.game.add.tween(crosshair);
                chRotateTween.to({angle: 360}, 6000, 'Linear', true, 0, true);

                let chScaleTween = this.game.add.tween(crosshair.scale);
                chScaleTween.from({x: 1.5, y: 1.5}, chargeTime, 'Linear', true, 0, false);

                let chAlphaTween = this.game.add.tween(crosshair);
                chAlphaTween.from({alpha: 0.2}, chargeTime, 'Linear', true, 0, false);

                let shockCharge = this.game.add.graphics(x, y);
                shockCharge.anchor.setTo(0.5);
                
                shockCharge.clear();
                shockCharge.lineStyle(2, 0xff0000);
                shockCharge.drawCircle(0, 0, radius * 2);

                shockCharge.scale.setTo(0);
                let tween = this.game.add.tween(shockCharge.scale);
                tween.to({x: 1, y: 1}, chargeTime, 'Linear', true, 0);

                this.dangerSound.play();

                tween.onComplete.add(() => {
                    this.shotSound.play();
                    // do damage if in range
                    this.game.physics.arcade.overlap(shockArea, player.sprite, () => {
                        player.health -= 1;
                        this.damageSound.play();
                        this.ui_lifebar.setText((player.health/5)*100);
                        console.log(`damaged! health down to ${player.health}`);
                    });
                    shockArea.destroy();
                    shockCharge.destroy();
                    crosshair.destroy();
                });
            }
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