// fits the PIXI.Sprite to the parent
// similar to CSS background-size: cover
module.exports = drawImageCover;
function drawImageCover (ctx, image, parent, scale) {
  scale = typeof scale === 'number' ? scale : 1;
  parent = typeof parent === 'undefined' ? ctx.canvas : parent;

  var tAspect = image.width / image.height;
  var pWidth = parent.width;
  var pHeight = parent.height;

  var pAspect = pWidth / pHeight;

  var width, height;
  if (tAspect > pAspect) {
    height = pHeight;
    width = height * tAspect;
  } else {
    width = pWidth;
    height = width / tAspect;
  }
  width *= scale;
  height *= scale;
  var x = (pWidth - width) / 2;
  var y = (pHeight - height) / 2;
  ctx.drawImage(image, x, y, width, height);
}
