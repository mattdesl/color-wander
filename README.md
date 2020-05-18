# Color wander

🎨 Generative artwork in node/browser based on a seeded random.

> I updated a little bit the code in order to get some inspiration, in order to learn real painting

Project forked from [mattdesl/color-wander](https://github.com/mattdesl/color-wander)

## 📦 Installation

```sh
git clone https://github.com/sandoche/color-wander
cd color-wander
cp .env.dist .env
sudo apt-get install libgif-dev
sudo apt-get install libjpeg-dev
npm install
```

## ⚙️ Usage

### Browser experience

```sh
npm run start
```

### Command line interface

When you find a seed you like, you can render it as a high-resolution (2560x1440) print. The following will render a PNG into the `output/` folder.

```sh
node print [seed]
```

Example:

```sh
node print 180423
```

> *Note:* For this experiment, the Node output resolution is currently the same as the browser canvas. Typically this approach, using `node-canvas`, is only worthwhile for much larger canvas resolutions.

### 🎨 Results

Checkout the results with different settings in [results](results)