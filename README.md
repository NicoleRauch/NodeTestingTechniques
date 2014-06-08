Node Testing Techniques
=======================

Here you find the slides and source code for the workshop.

How to run the code
-------------

You need `node.js` as a JavaScript runtime. With it comes the package manager `npm`. Some of the modules have native C-dependencies so you will also need a C-compiler to get up and running.

1. Clone the repository
1. To run the code, you need to install node.js. Get it from [http://nodejs.org](http://nodejs.org).
1. Inside the folder `sources` you will find some JavaScript projects, each with two subdirectories `problem` and `solution`.
1. Globally install grunt via `npm install -g grunt-cli`.
1. In each project run `npm install`.
1. You can check the installation by running `grunt` from the commandline. No arguments required.
1. If the tests succeed you can usually start the app vie `node start`

How to watch the slides
-----------------------
The slides are created as html-slides based on the great work [`reveal.js`](http://lab.hakim.se/reveal-js/#/) by [Hakim El Hattab](http://hakim.se)

1. Clone the project [https://github.com/hakimel/reveal.js](https://github.com/hakimel/reveal.js).
1. Copy the files and folders inside `slides` to the root directory of reveal.js - or
1. Make symlinks to those files
1. Open the file `slides.html`
1. Have fun

