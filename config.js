var SEED = 'i';

var seedRandom = require('seed-random');
var palettes = require('./lib/color-palettes');
var random = typeof SEED === 'undefined'
  ? Math.random
  : seedRandom(SEED);

module.exports = {
  // rendering options
  random: random,
  pointilism: 0,
  noiseScalar: [ 0.0000001, 0.0002 ],
  globalAlpha: 0.5,
  startArea: 0.05,
  maxRadius: 30,
  lineStyle: 'square',
  interval: 0.01,
  count: 500,
  steps: 500,
  endlessBrowser: false, // Whether to endlessly step in browser

  // background image that drives the algorithm
  debugLuma: false,
  backgroundScale: 1,
  backgorundFille: 'black',
  backgroundSrc: 'maps/church2.jpg',

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
