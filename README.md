# color-wander

Generative artwork in node/browser based on a seeded random.

Blog post and more details:

[Generative Art with Node.js and Canvas](http://mattdesl.svbtle.com/generative-art-with-nodejs-and-canvas)

## Live Demo

You can view the algorithm in real-time here:

http://color-wander.surge.sh/

In Chrome, you can right-click the canvas an "Save As" to get the full resolution.

## Outputs

Here are a few examples.

<img src="http://i.imgur.com/VU7G4LX.jpg" width="85%" />  
<img src="http://i.imgur.com/ooYrDUW.jpg" width="85%" />  
<img src="http://i.imgur.com/dTb32La.jpg" width="85%" />  
<img src="http://i.imgur.com/IrZGveh.jpg" width="85%" />  
<img src="http://i.imgur.com/TyI4sQX.jpg" width="85%" />  
<img src="http://i.imgur.com/5QRD3Ps.jpg" width="85%" />  

You can download some of these as lossless PNG [here](https://www.dropbox.com/sh/qhrwaw2rzjqbf5r/AABsYzFc7a4ewWkIJYHHBs85a?dl=0).

## Usage

```sh
git clone https://github.com/mattdesl/color-wander.git
cd color-wander
npm install
```

To run the browser experience:

```sh
npm run start
```

When you find a seed you like, you can render it as a high-resolution (2560x1440) print. The following will render a PNG into the `output/` folder.

```sh
node print [seed]
```

Example:

```sh
node print 180423
```

> *Note:* For this experiment, the Node output resolution is currently the same as the browser canvas. Typically this approach, using `node-canvas`, is only worthwhile for much larger canvas resolutions.

## License

The source code is licensed under MIT, the actual design/visuals/concept/artwork is licensed under [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nc-nd/4.0/). If you need a more specific license for commercial reasons, please open a new issue to discuss it with me.