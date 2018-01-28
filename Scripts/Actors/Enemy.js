import Actor from './Actor';

export default class Enemy extends Actor
{
    constructor(_sprite, _scale, _game, _fog)
    {
        super(_sprite, _scale, _game);
        
        // Add Animation
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 8, true);

        _sprite.visible = false;
        // Add Collision
        _sprite.body.setCircle(210);

        // Add Fog
        this.fog = _fog;
        this.fog.anchor.setTo(0.5);
        this.fog.scale.setTo(_scale * 2);
        this.transform.addChild(this.fog);
        this.fog.visible = false;
    }

    Update()
    {
        //console.log("EnemyUpdate");
    }

}