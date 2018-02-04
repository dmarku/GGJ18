# Find your Alien Friend - A Game for Global Game Jam 2018

This game was developed over the course of 48 hours during the Global Game Jam 2018.

*  Stephan Schüritz - programming
*  Markus Dittmann - programming
*  Nicole Tietze - graphics, animation and sound
*  Max Reimann - user stories

## Setup and Running from Source

The game runs entirely in the browser. However, to build a working version from the JavaScript source files requires [Webpack](https://webpack.js.org/).

1)  Make sure you have Node.js and NPM installed on your system and that you can run them from a command line, i.e. they are on your PATH environment variable so you can type `npm` and the NPM executable starts)

2)  Download (and unpack) the source files, either from the [Github project page](https://github.com/StephanSchue/GGJ18) or via git:

    ```bash
    git clone https://github.com/StephanSchue/GGJ18.git
    ```

3)  Change into the project directory and run `npm install` to download and install the project's dependencies. This may take a while.

4)  Once that's done, you can build the game with `npm run build` and then open the `index.html` file in your browser.

    Alternatively, run `npm run dev` and open `localhost:8080` in your browser. Any changes to the javascript files should trigger an automatic page reload.