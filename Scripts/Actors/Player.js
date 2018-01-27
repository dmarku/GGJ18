import Actor from './Actor';
import Cycle from './../ConeController';

export default class Player extends Actor 
{
    constructor(_sprite, _scale, _input, _game)
    {
        // --- Set Components ---
        super(_sprite, _scale, _game);
        this.input = _input;

        // --- Set Input-Variales ---
        this.forwardSpeed = 3;
        this.backforwardSpeed = -1.5;
        this.cursorKeys = _game.input.keyboard.createCursorKeys();

        // --- Setup Object ---
        _sprite.anchor.setTo(0.5);
        _sprite.angle = -90;

        // --- Cones ---
        this.cones = new Cycle([
            {range: 500, angle: 5},
            {range: 300, angle: 45},
            {range: 150, angle: 120},
        ], 1);
        
        this.scanCone = _game.make.graphics(0, 0);
        this.transform.addChild(this.scanCone);

        // -- Add Cone Input --
        this.conesNextKey = _game.input.keyboard.addKey(Phaser.Keyboard.F),
        this.conesPrevKey = _game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.conesNextKey.onDown.add(() => this.cones.next());
        this.conesPrevKey.onDown.add(() => this.cones.previous());

        // -- Bring to top --
        _game.world.bringToTop(this.transform);
    }

    Update()
    {
        //console.log("PlayerUpdate");
        this.UpdateInput();
        this.UpdateCone();
    }

    UpdateInput()
    {
        this.input.update();

        if(this.cursorKeys.left.isDown) 
        {
            this.transform.angle -= 5;
        }

        if(this.cursorKeys.right.isDown) 
        {
            this.transform.angle += 5;
        }

        if(this.input.isPositive()) 
        {
            this.transform.position.add(
                this.forwardSpeed * Math.cos(this.transform.rotation),
                this.forwardSpeed * Math.sin(this.transform.rotation));
        }

        if(this.input.isNegative()) 
        {
            this.transform.position.add(
                this.backforwardSpeed * Math.cos(this.transform.rotation),
                this.backforwardSpeed * Math.sin(this.transform.rotation));
        }
    }

    UpdateCone()
    {
        let {range, angle} = this.cones.current();

        this.scanCone.clear();
        this.scanCone.beginFill(0x202020);
        this.scanCone.arc(0, 0, range, 0.5 * angle / 180 * Math.PI, -0.5 * angle / 180 * Math.PI, true);
        this.scanCone.endFill();
    }
}