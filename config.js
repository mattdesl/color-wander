var SEED = String(Math.floor(Math.random() * 1000));
console.log('Seed:', SEED);

var seedRandom = require('seed-random');
var palettes = require('./lib/color-palettes');
var randomFunc = typeof SEED === 'undefined'
  ? Math.random
  : seedRandom(SEED);

var random = require('./lib/random-range')(randomFunc);

var maps = [
  'maps/church2.jpg',
  'maps/city4.jpg',
  'maps/city5.jpg',
  'maps/eye.jpg'
];

var mapSrc = maps[Math.floor(random(maps.length))];
console.log(mapSrc);

module.exports = {
  // rendering options
  random: randomFunc,
  pointilism: random(0, 0.1),
  noiseScalar: [ 0.0000001, 0.0002 ],
  globalAlpha: 0.5,
  startArea: random(0.05, 0.75),
  maxRadius: random(10, 50),
  lineStyle: 'square',
  interval: 0.01,
  count: Math.floor(random(50, 500)),
  steps: 1000,
  endlessBrowser: false, // Whether to endlessly step in browser

  // background image that drives the algorithm
  debugLuma: false,
  backgroundScale: 1,
  backgorundFille: 'black',
  backgroundSrc: mapSrc,

  // browser/node options
  pixelRatio: 1,
  width: 1280,
  height: 720,
  palette: palettes[Math.floor(random() * palettes.length)],

  // node only options
  asVideoFrames: false,
  filename: 'render',
  outputDir: 'output'
};
