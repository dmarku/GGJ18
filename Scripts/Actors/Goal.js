import Actor from './Actor';

export default class Goal extends Actor
{
    constructor(_sprite, _scale, _game)
    {
        super(_sprite, _scale, _game);
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 8, true);

        _sprite.body.setCircle(150);
    }

    ShowFog(radius)
    {
        
    }

    Update()
    {
        //console.log("GoalUpdate");
    }
}