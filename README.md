# color-wander

Generative artwork in node/browser based on a seeded random.

Blog post and more details:

[Generative Art with Node.js and Canvas](http://mattdesl.svbtle.com/generative-art-with-nodejs-and-canvas)

## Live Demo

You can view the algorithm in real-time here:

http://color-wander.surge.sh/

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

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/color-wander/blob/master/LICENSE.md) for details.
