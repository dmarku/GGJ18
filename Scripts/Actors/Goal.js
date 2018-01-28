import Actor from './Actor';

export default class Goal extends Actor
{
    constructor(_sprite, _scale, _game, _fog)
    {
        super(_sprite, _scale, _game);
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 8, true);
        _sprite.visible = false;

        // Add Physics
        _sprite.body.setCircle(130, 75, 126);
        
        // Add Fog
        this.fog = _fog;
        this.fog.anchor.setTo(0.5);
        this.fog.scale.setTo(_scale * 2);
        this.transform.addChild(this.fog);
        this.fog.visible = false;
    }

    UpdateVisibility(level)
    {
        console.log(this.fog.alpha);
        if(!this.fog.visible)
        {
            this.fog.visible = true;
        }
        else if(this.fog.alpha > 0)
        {
            this.fog.alpha -= 0.33 * (level);

            if(this.fog.alpha < 0.2)
                this.sprite.visible = true;
        }
    }

    Update()
    {
        //console.log("GoalUpdate");
    }
}