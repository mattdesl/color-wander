var shuffle = require('array-shuffle');
var palettes = require('./lib/color-palettes');

palettes = shuffle(palettes);
// var paletteIndex = 33;
// var paletteIndex = 19;
var palette = palettes[0];

module.exports = {
  // rendering options
  pointilism: 0,
  noiseScalar: [ 0.0000001, 0.0004 ],
  globalAlpha: 0.5,
  startArea: 0.75,
  maxRadius: 30,
  lineStyle: 'square',

  // background image that drives the algorithm
  debugLuma: false,
  backgroundScale: 1,
  backgorundFille: 'black',
  backgroundSrc: 'maps/church2.jpg',

  // browser/node options
  pixelRatio: 1,
  width: 1280,
  height: 720,
  count: 500,
  palette: palette,
  interval: 0.0001,

  // node only options
  steps: 100,
  asVideoFrames: false,
  filename: 'render',
  outputDir: 'output'
};
