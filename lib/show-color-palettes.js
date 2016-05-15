// For the blog post :) 

var fs = require('fs');
var path = require('path');
var outfile = path.resolve(__dirname, '../output/palettes.png');

var Canvas = require('canvas');

var palettes = require('./color-palettes.json');

var tileSize = 52;

var rows = 10;
var padding = 5;
var count = palettes.length;
var cols = Math.ceil(count / rows);
var width = tileSize * cols + padding * (cols + 1);
var height = tileSize * rows + padding * (rows + 1);
var canvas = new Canvas(width, height);
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);
palettes.forEach((palette, i) => {
  var x = Math.floor(i % cols);
  var y = Math.floor(i / cols);

  palette.forEach((color, j, colors) => {
    // var t = j / (colors.length - 1);
    var sliceWidth = tileSize / colors.length;
    var tx = (x * (padding + tileSize)) + j * sliceWidth;
    ctx.fillStyle = color;
    ctx.fillRect(
      padding + tx,
      padding + y * (padding + tileSize),
      sliceWidth,
      tileSize);
  });
});

fs.writeFile(outfile, canvas.toBuffer(), (err) => {
  if (err) throw err;
});
