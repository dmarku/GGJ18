
export default class GameController 
{
    // 0 = Init
    // 1 = Start
    // 2 = Loop
    // 3 = GameOver

    constructor() 
    {
        this.state = 0;
        this.player = null;
        this.enemies = [];
        this.goal = null;
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

    //#region GameSystem

    StartGame()
    {

    }

    Update()
    {
        this.player.Update();
        for (let enemy of this.enemies) {
            enemy.Update();
        }
    }

    scan ()
    {
        game.physics.arcade.overlap(this.player.scanCone, this.enemies, (player, enemy) => {
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
    //#endregion
}