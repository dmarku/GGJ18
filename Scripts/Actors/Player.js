import Actor from './Actor';

export default class Player extends Actor 
{
    constructor(_sprite)
    {
        super(_sprite);
    }

    Update()
    {
        console.log("PlayerUpdate");
    }
}