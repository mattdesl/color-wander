require('dotenv').config()

var seedRandom = require('seed-random');
var palettes = require('./lib/color-palettes.json');
var createRandomRange = require('./lib/random-range');

var MIN_STEPS = parseInt(process.env.MIN_STEPS) || 100;
var MAX_STEPS = parseInt(process.env.MAX_STEPS) || 1000;

var MIN_COUNT = parseInt(process.env.MIN_COUNT) || 50;
var MAX_COUNT = parseInt(process.env.MAX_COUNT) || 2000;

var MIN_MAX_RADIUS = parseInt(process.env.MIN_MAX_RADIUS) || 5;
var MAX_MAX_RADIUS = parseInt(process.env.MAX_MAX_RADIUS) || 100;

var MIN_START_AREA = parseInt(process.env.MIN_START_AREA) || 0;
var MAX_START_AREA = parseInt(process.env.MAX_START_AREA) || 1.5;



module.exports = function (seed) {
  if (typeof seed === 'undefined') {
    seed = String(Math.floor(Math.random() * 1000000));
  }

  console.log('Seed:', seed);

  var randomFunc = seedRandom(seed);
  var random = createRandomRange(randomFunc);

  var maps = [
    'sym6.jpg', 'sym3.jpg',
    'scifi.jpg', 'nature1.jpg',
    'map7.jpg', 'geo5.jpg', 'geo4.jpg',
    'geo3.jpg', 'geo1.jpg', 'fractal2.jpg',
    'fractal1.jpg', 'eye.jpg', 'city5.jpg',
    'city2.jpg', 'church2.jpg', 'architecture.jpg',
    'pat1.jpg', 'sea1.jpg', 'sea2.jpg', 'sea3.jpg',
    'sea4.jpg', 'sea5.jpg', 'sea6.jpg', 'sea7.jpg'
  ].map(function (p) {
    return 'maps/' + p;
  });

  var mapSrc = maps[Math.floor(random(maps.length))];

  return {
    // rendering options
    random: randomFunc,
    seedName: seed,
    pointilism: random(0, 0.1),
    noiseScalar: [ random(0.000001, 0.000001), random(0.0002, 0.004) ],
    globalAlpha: 0.5,
    startArea: random(MIN_START_AREA, MAX_START_AREA),
    maxRadius: random(MIN_MAX_RADIUS, MAX_MAX_RADIUS),
    lineStyle: random(1) > 0.5 ? 'round' : 'square',
    interval: random(0.001, 0.01),
    count: Math.floor(random(MIN_COUNT, MAX_COUNT)),
    steps: Math.floor(random(MIN_STEPS, MAX_STEPS)),
    endlessBrowser: false, // Whether to endlessly step in browser

    // background image that drives the algorithm
    debugLuma: false,
    backgroundScale: 1,
    backgorundFille: 'black',
    backgroundSrc: mapSrc,

    // browser/node options
    pixelRatio: 1,
    width: 1024 * 2,
    height: 1024 * 2,
    palette: getPalette(),

    // node only options
    asVideoFrames: false,
    filename: 'render',
    outputDir: 'output'
  };

  function getPalette () {
    var paletteColors = palettes[Math.floor(random() * palettes.length)];
    return arrayShuffle(paletteColors);
  }

  function arrayShuffle (arr) {
    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();

    while (len) {
      rand = Math.floor(random(1) * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }

    return ret;
  }
};
