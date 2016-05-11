var newArray = require('new-array');
var lerp = require('lerp');
var clamp = require('clamp');
var randomRange = require('./random-range');

var vec2 = require('gl-vec2');
var SimplexNoise = require('simplex-noise');

var getLumaPixels = require('./getLumaPixels');

module.exports = function createRenderer (opt) {
  opt = opt || {};

  var randFunc = opt.random || Math.random;
  var random = randomRange(randFunc);

  var simplex = new SimplexNoise(randFunc);
  var ctx = opt.context;
  var dpr = typeof opt.pixelRatio === 'number' ? opt.pixelRatio : 1;
  var canvas = ctx.canvas;
  var width = canvas.width;
  var height = canvas.height;
  var count = opt.count || 0;
  var palette = opt.palette || ['#fff', '#000'];
  var backgroundImage = opt.backgroundImage;

  var maxRadius = typeof opt.maxRadius === 'number' ? opt.maxRadius : 10;
  var startArea = typeof opt.startArea === 'number' ? opt.startArea : 0.5;
  var pointilism = lerp(0.000001, 0.5, opt.pointilism);
  var noiseScalar = opt.noiseScalar || [0.00001, 0.0001];
  var globalAlpha = typeof opt.globalAlpha === 'number' ? opt.globalAlpha : 1;

  var heightMapImage = getLumaPixels(ctx, backgroundImage, {
    scale: opt.backgroundScale,
    fillStyle: opt.backgroundFill
  });
  var heightMap = heightMapImage.data;
  var time = 0;
  var particles = newArray(count).map(() => resetParticle());

  return {
    clear: clear,
    step: step,
    debugLuma: function () {
      ctx.putImageData(heightMapImage, 0, 0);
    }
  };

  function clear () {
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function step (dt) {
    time += dt;
    particles.forEach((p, i) => {
      var x = p.position[0];
      var y = p.position[1];

      var fx = clamp(Math.round(x), 0, canvas.width - 1);
      var fy = clamp(Math.round(y), 0, canvas.height - 1);
      var heightIndex = fx + (fy * canvas.width);
      var heightValue = heightMap[heightIndex * 4] / 255;

      var pS = lerp(noiseScalar[0], noiseScalar[1], heightValue);
      var n = simplex.noise3D(fx * pS, fy * pS, p.duration + time);
      var angle = n * Math.PI * 2;
      var speed = p.speed + lerp(0.0, 2, 1 - heightValue);
      vec2.add(p.velocity, p.velocity, [ Math.cos(angle), Math.sin(angle) ]);
      vec2.normalize(p.velocity, p.velocity);
      var move = vec2.scale([], p.velocity, speed);
      vec2.add(p.position, p.position, move);

      var s2 = pointilism;
      var r = p.radius * simplex.noise3D(x * s2, y * s2, p.duration + time);
      r *= lerp(0.01, 1.0, heightValue);
      ctx.beginPath();
      ctx.lineTo(x, y);
      ctx.lineTo(p.position[0], p.position[1]);
      ctx.lineWidth = r * (p.time / p.duration);
      ctx.lineCap = opt.lineStyle || 'square';
      ctx.lineJoin = opt.lineStyle || 'square';
      ctx.strokeStyle = p.color;

      // ctx.strokeStyle = colorStyle(rgb.map(x => x * 255));
      ctx.globalAlpha = globalAlpha;
      ctx.stroke();

      p.time += dt;
      if (p.time > p.duration) {
        resetParticle(p);
      }
    });
  }

  function resetParticle (p) {
    p = p || {};
    var scale = Math.min(width, height) / 2;
    p.position = randomSphere([], random(0, scale * startArea));
    p.position[0] += width / 2;
    p.position[1] += height / 2;
    p.radius = random(0.01, maxRadius);
    p.duration = random(1, 500);
    p.time = random(0, p.duration);
    p.velocity = [ random(-1, 1), random(-1, 1) ];
    p.speed = random(0.5, 2) * dpr;
    
    // Note: We actually include the background color here.
    // This means some strokes may seem to "erase" the other
    // colours, which can add a nice effect.
    p.color = palette[Math.floor(random(palette.length))];
    return p;
  }

  function randomSphere (out, scale) {
    scale = scale || 1.0;
    var r = randFunc() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
  }
};
