var seedRandom = require('seed-random');
var createRandomRange = require('./lib/random-range');

module.exports = function (seed) {
  if (typeof seed === 'undefined') {
    seed = String(Math.floor(Math.random() * 1000000));
  }

  console.log('Seed:', seed);

  var randomFunc = seedRandom(seed);
  var random = createRandomRange(randomFunc);

  var maps = [
    'azulejo-granada.jpg'
  ].map(function (p) {
    return 'maps/' + p;
  });

  var mapSrc = maps[Math.floor(random(maps.length))];

  return {
    // rendering options
    random: randomFunc,
    seedName: seed,
    pointilism: random(0, 0.2),
    noiseScalar: [ random(0.000001, 0.000001), random(0.0002, 0.004) ],
    globalAlpha: 0.5,
    startArea: random(0.0, 1),
    maxRadius: random(5, 100),
    lineStyle: random(1) > 0.5 ? 'round' : 'square',
    interval: random(0.001, 0.01),
    count: Math.floor(random(50, 2000)),
    steps: Math.floor(random(100, 1000)),
    endlessBrowser: true, // Whether to endlessly step in browser

    // background image that drives the algorithm
    debugLuma: false,
    backgroundScale: 1,
    backgorundFille: 'black',
    backgroundSrc: mapSrc,

    // browser/node options
    pixelRatio: 1,
    width: 1280 * 2,
    height: 720 * 2,

    // node only options
    asVideoFrames: false,
    filename: 'render',
    outputDir: 'output'
  };
};
