var mapLimit = require('map-limit');
var newArray = require('new-array');
var Canvas = require('canvas');
var Image = Canvas.Image;
var padLeft = require('pad-left');
var assign = require('object-assign');
var commonMetaData = require('../output_json/common_metadata.json')
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
  var seedName = typeof opt.seedName !== 'undefined' ? opt.seedName.toString() : '';
  var filename = seedName;
  var outputDir = opt.outputDir || process.cwd();
  var outputJsonDir = opt.outputJsonDir || process.cwd();
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

  function render() {
    renderer.clear();
    for (var i = 0; i < steps; i++) {
      console.log((i + 1) + ' / ' + steps);
      renderer.step(interval);
      frame++;
    }
    outputCanvas(false);
  }

  function renderAsync() {
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

  function outputCanvas(isAsync, cb) {
    var stamp = isAsync ? padLeft(frame, frameDigits, '0').toString() : '';
    var filePath = path.resolve(outputDir, filename + stamp + '.png');
    var jsonFilePath = path.resolve(outputJsonDir, filename + stamp + '.json');

    const metadata = Object.assign({}, commonMetaData);
    metadata.name = metadata.name + " #" + filename
    metadata.image = metadata.image + filename + '.png'
    metadata.attributes = [
      {
        "display_type": "number",
        "trait_type": "Edition",
        "value": getGeneration(parseInt(filename))
      }
    ]

    fs.writeFile(jsonFilePath, JSON.stringify(metadata));
    fs.writeFile(filePath, canvas.toBuffer(), cb);
  }

  function getGeneration(seed) {
    if (seed >= 0 && seed <= 1000) {
      return 1
    }
    if (seed >= 1001 && seed <= 5000) {
      return 2
    }
    return 3;
  }
};
