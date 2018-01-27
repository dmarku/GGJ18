import Actor from './Actor';
import Cycle from './../ConeController';

export default class Player extends Actor 
{
    constructor(_sprite, _scale, _game)
    {
        // --- Set Components ---
        super(_sprite, _scale, _game);

        // --- Set Input-Variales ---
        this.forwardSpeed = 3;
        this.backforwardSpeed = -1.5;

        // --- Setup Object ---
        _sprite.anchor.setTo(0.5);
        // turn to make the sprite face to the right
        _sprite.angle = -90;
        _sprite.animations.add('idle');
        _sprite.animations.play('idle', 12, true);

        // --- Cones ---
        this.cones = new Cycle([
            {range: 500, angle: 5},
            {range: 300, angle: 45},
            {range: 150, angle: 120},
        ], 1);
        
        this.scanCone = _game.make.graphics(0, 0);
        this.transform.addChild(this.scanCone);

        _game.physics.enable(this.scanCone, Phaser.Physics.ARCADE);
        let { range } = this.cones.current();
        this.scanCone.body.setCircle(range, -range, -range);
        this.transform.addChild(this.scanCone);

        // -- Add Cone Input --
        this.conesNextKey = _game.input.keyboard.addKey(Phaser.Keyboard.F),
        this.conesPrevKey = _game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.conesNextKey.onDown.add(() => this.cones.next());
        this.conesPrevKey.onDown.add(() => this.cones.previous());

        // -- Bring to top --
        _game.world.bringToTop(this.transform);

        _sprite.body.setCircle(210);
    }

    Update()
    {
        //console.log("PlayerUpdate");
        this.UpdateCone();
    }

    MoveBy(point)
    {
        this.transform.angle += point.x * 5;

        if(point.y > 0)
        {
            this.transform.position.add(
                this.forwardSpeed * Math.cos(this.transform.rotation),
                this.forwardSpeed * Math.sin(this.transform.rotation));
        }
        else if(point.y < 0)
        {
            this.transform.position.add(
                this.backforwardSpeed * Math.cos(this.transform.rotation),
                this.backforwardSpeed * Math.sin(this.transform.rotation));
        }
    }

    UpdateCone()
    {
        let {range, angle} = this.cones.current();

        this.scanCone.body.setCircle(range, -range, -range);

        this.scanCone.clear();
        this.scanCone.lineStyle(2, 0x00c000, 0.4);
        this.scanCone.beginFill(0x00ff00, 0.1);
        this.scanCone.arc(0, 0, range, 0.5 * angle / 180 * Math.PI, -0.5 * angle / 180 * Math.PI, true);
        this.scanCone.endFill();
    }
}