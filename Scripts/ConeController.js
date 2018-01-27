
export default class Cycle 
{
    // initialize this with a list of { range, angle } objects
    constructor(variants, initialIndex) 
    {
        this.variants = variants;
        this.currentIndex = initialIndex || 0;
    }

    current () 
    {
        return this.variants[this.currentIndex];
    }

    next () 
    {
        this.currentIndex++;
        if (this.currentIndex > this.variants.length - 1) this.currentIndex = 0;
    }

    previous () 
    {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.variants.length - 1;
    }
}