var smoothstep = require('smoothstep');
var luminance = require('color-luminance');
var drawImageCover = require('./drawImageCover');

module.exports = getLumaPixels;
function getLumaPixels (ctx, img, opt) {
  var canvas = ctx.canvas;
  var scale = typeof opt.scale === 'number' ? opt.scale : 1;
  var threshold = Array.isArray(opt.threshold) ? opt.threshold : null;
  ctx.fillStyle = opt.fillStyle || 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawImageCover(ctx, img, canvas, scale);

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var rgba = imageData.data;

  for (var i = 0; i < canvas.width * canvas.height; i++) {
    var r = rgba[i * 4 + 0];
    var g = rgba[i * 4 + 1];
    var b = rgba[i * 4 + 2];

    // grayscale
    var L = luminance(r, g, b);

    // optional threshold
    if (threshold) {
      L = Math.floor(smoothstep(threshold[0], threshold[1], L / 255) * 255);
    }

    // replace RGBA
    rgba[i * 4 + 0] = L;
    rgba[i * 4 + 1] = L;
    rgba[i * 4 + 2] = L;
  }
  return imageData;
}
