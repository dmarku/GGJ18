export default class InputPair 
{
    constructor(game, positiveKey, negativeKey) {
        this.game = game;

        this.positiveKey = positiveKey;
        this.negativeKey = negativeKey;

        this.direction = 0;
    }

    update () 
    {
        this.direction = 0;
        
        if(this.game.input.keyboard.isDown(this.positiveKey)) 
        {
            this.direction += 1;
        }

        if(this.game.input.keyboard.isDown(this.negativeKey)) 
        {
            this.direction -= 1;
        }
        
        console.log(this.direction);
    }

    isPositive () {
        return this.direction > 0;
    }

    isNegative () {
        return this.direction < 0;
    }
}