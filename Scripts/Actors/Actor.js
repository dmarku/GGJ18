
export default class Actor 
{
    constructor(_sprite, _scale, _game)
    {
        this.sprite = _sprite;
        this.sprite.animations.add('idle');
        this.sprite.animations.play('idle', 12, true);
        this.sprite.scale.setTo(_scale);
        this.game = _game;
    }

    Update()
    {
        console.log("ActorUpdate");
    }
}