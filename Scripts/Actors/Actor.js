
export default class Actor 
{
    constructor(_sprite)
    {
        this.sprite = _sprite;
        this.sprite.animations.add('idle');
        this.sprite.animations.play('idle', 12, true);
    }
}