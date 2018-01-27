import Actor from './Actor';

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
        this.transform = _game.add.group();
        this.transform.addChild(_sprite);

        _sprite.anchor.setTo(0.5);
        _sprite.angle = -90;
    }

    Update()
    {
        console.log("PlayerUpdate");
        this.UpdateInput();
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
}