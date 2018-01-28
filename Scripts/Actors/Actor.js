
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
    }

    UpdateVisibility(level)
    {
        if(!this.fog.visible)
        {
            this.fog.visible = true;
        }
        else if(this.fog.alpha > 0)
        {
            this.fog.alpha -= 0.05 * (level);

            if(this.fog.alpha < 0.2)
                this.sprite.visible = true;
        }
    }

    Update()
    {
        //console.log("ActorUpdate");
    }
}