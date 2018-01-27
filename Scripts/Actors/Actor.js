
export default class Actor 
{
    constructor(_sprite, _scale)
    {
        this.sprite = _sprite;
        this.sprite.animations.add('idle');
        this.sprite.animations.play('idle', 12, true);
        this.sprite.scale.setTo(_scale);
    }

    Update()
    {
        console.log("ActorUpdate");
    }
}