import Actor from './Actor';

export default class Enemy extends Actor
{
    constructor(_sprite, _scale, _game)
    {
        super(_sprite, _scale, _game);
    }

    ShowFog(radius)
    {
        
    }

    Update()
    {
        console.log("EnemyUpdate");
    }

}