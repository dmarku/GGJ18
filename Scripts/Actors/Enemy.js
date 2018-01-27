import Actor from './Actor';

export default class Enemy extends Actor
{
    constructor(_sprite, _scale, _game)
    {
        super(_sprite, _scale, _game);
        this.SetVisible(false);
    }

    Update()
    {
        console.log("EnemyUpdate");
    }

}