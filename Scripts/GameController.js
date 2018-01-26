
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
    }

    RegisterPlayer(_player)
    {
        this.player = _player;
    }

    //#region GameSystem

    StartGame()
    {

    }

    Update()
    {
        this.player.Update();
    }

    //#endregion
}