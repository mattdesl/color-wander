var mapLimit = require('map-limit');
var newArray = require('new-array');
var Canvas = require('canvas');
var Image = Canvas.Image;
var padLeft = require('pad-left');
var assign = require('object-assign');

var path = require('path');
var createRenderer = require('./createRenderer');
var fs = require('fs');

module.exports = function (opt, cb) {
  var renderer;
  var pixelRatio = typeof opt.pixelRatio === 'number' ? opt.pixelRatio : 1;
  var canvas = new Canvas(opt.width * pixelRatio, opt.height * pixelRatio);
  var context = canvas.getContext('2d');

  var steps = opt.steps;
  var frameDigits = String(steps).length;
  var seedName = typeof opt.seedName !== 'undefined' ? ('_' + opt.seedName) : '';
  var filename = (opt.filename || 'render') + seedName;
  var outputDir = opt.outputDir || process.cwd();
  var frame = 0;
  var interval = typeof opt.interval === 'number' ? opt.interval : 0.0001;
  var cwd = opt.cwd || process.cwd();

  fs.readFile(path.resolve(cwd, opt.backgroundSrc), (err, buffer) => {
    if (err) return cb(err);
    var backgroundImage = new Image();
    backgroundImage.src = buffer;

    var debugLuma = opt.debugLuma;
    var asVideoFrames = opt.asVideoFrames;

    renderer = createRenderer(assign(opt, {
      backgroundImage: backgroundImage,
      context: context
    }));

    if (debugLuma) {
      renderer.debugLuma();
      outputCanvas();
    } else {
      if (asVideoFrames) renderAsync();
      else render();
    }
  });

  function render () {
    renderer.clear();
    for (var i = 0; i < steps; i++) {
      console.log((i + 1) + ' / ' + steps);
      renderer.step(interval);
      frame++;
    }
    outputCanvas(false);
  }

  function renderAsync () {
    renderer.clear();

    var array = newArray(steps);
    var i = 0;
    mapLimit(array, 1, (item, next) => {
      console.log((i++ + 1) + ' / ' + steps);
      renderer.step(interval);
      outputCanvas(true, next);
      frame++;
    }, (err) => {
      if (err) throw err;
      console.log('Finished');
    });
  }

  function outputCanvas (isAsync, cb) {
    var stamp = isAsync ? ('_' + padLeft(frame, frameDigits, '0')) : '';
    var filePath = path.resolve(outputDir, filename + stamp + '.png');
    fs.writeFile(filePath, canvas.toBuffer(), cb);
  }
};
