import Actor from './Actor';

export default class Enemy extends Actor
{
    constructor(_sprite, _scale, _game)
    {
        super(_sprite, _scale, _game);
        
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 8, true);

        _sprite.visible = false;
    }

    ShowFog(radius)
    {
        
    }

    Update()
    {
        //console.log("EnemyUpdate");
    }

}