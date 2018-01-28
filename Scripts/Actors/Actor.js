
export default class Actor 
{
    constructor(_sprite, _scale, _game)
    {
        this.sprite = _sprite;
        this.sprite.anchor.setTo(0.5);
        this.sprite.scale.setTo(_scale);
        this.game = _game;

        this.transform = _game.add.group();
        this.transform.addChild(_sprite);

        this.game.physics.enable(_sprite, Phaser.Physics.ARCADE);

        this.fog = null;
    }

    Update()
    {
        //console.log("ActorUpdate");
    }
}