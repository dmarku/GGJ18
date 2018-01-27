
export default class Actor 
{
    constructor(_sprite, _scale, _game)
    {
        this.sprite = _sprite;
        this.sprite.animations.add('idle');
        this.sprite.animations.play('idle', 12, true);
        this.sprite.scale.setTo(_scale);
        this.game = _game;

        this.transform = _game.add.group();
        this.transform.addChild(_sprite);

        this.transform.enableBody = true;
        this.transform.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.physics.enable(this.transform, Phaser.Physics.ARCADE);
    }

    SetVisible(status)
    {
        this.sprite.visible = status;
    }

    Update()
    {
        console.log("ActorUpdate");
    }

    OnCollision()
    {
        
    }
}