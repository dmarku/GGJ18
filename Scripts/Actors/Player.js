import Actor from './Actor';

export default class Player extends Actor 
{
    constructor(_sprite, _scale)
    {
        super(_sprite, _scale);
    }

    Update()
    {
        console.log("PlayerUpdate");
    }
}