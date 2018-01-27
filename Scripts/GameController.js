
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
        this.enemies = null;
    }

    RegisterPlayer(_player)
    {
        this.player = _player;
    }

    RegisterEnemy(_enemy)
    {
        this.enemies.push(_enemy);
    }

    //#region GameSystem

    StartGame()
    {

    }

    Update()
    {
        this.player.Update();

        if(this.enemies)
        {
            for(i = 0; i < this.enemies; i++) 
            {
                this.enemies[i].Update();
            }
        }
    }

    //#endregion
}