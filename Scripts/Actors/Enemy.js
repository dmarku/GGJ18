import Actor from './Actor';

export default class Enemy extends Actor
{
    constructor(_sprite, _scale, _game, _fog, _circle, _tween)
    {
        super(_sprite, _scale, _game);
        
        // Add Animation
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 8, true);

        _sprite.visible = false;
        // Add Collision
        _sprite.body.setCircle(170, 100, 117);

        // Add Fog
        this.fog = _fog;
        this.fog.anchor.setTo(0.5);
        this.fog.scale.setTo(_scale * 2);
        this.transform.addChild(this.fog);
        this.fog.visible = false;

        this.isCharging = false;

        this.chargeCircle = _circle;
        _circle.anchor.setTo(0.5);
        _circle.visible = true;
        this.chargeCircle.clear();
        this.chargeCircle.beginFill(0xffffff);
        this.chargeCircle.drawCircle(0, 0, 100);
        this.chargeCircle.endFill();
        this.transform.addChild(_circle);

        // --- Targeting system ---
        this.targetingRange = 300;
        
        let targetingCircle = _game.make.graphics(this.sprite.position.x, this.sprite.position.y);

        this.transform.add(targetingCircle);
        this.targetingCircle = targetingCircle;

        targetingCircle.anchor.setTo(0.5);
        targetingCircle.visible = false;

        targetingCircle.clear();
        targetingCircle.lineStyle(2, 0xff0000, 0.4);
        targetingCircle.drawCircle(0, 0, this.targetingRange * 2);

        _game.physics.enable(targetingCircle, Phaser.Physics.ARCADE);
        targetingCircle.body.setCircle(this.targetingRange, 0, 0);

        this.chargeTween = _tween;
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

    ChargeShotAt(target) 
    {
        this.isCharging = true;
        this.chargeCircle.scale.setTo(0.3);
        this.chargeCircle.visible = true;
        this.chargeTween.start();

        /*this.chargeTween.onCompleted = () => {
            this.isCharging = false;
            this.chargeCircle.visible = false;
        };*/
    }

    Update()
    {
    }

}