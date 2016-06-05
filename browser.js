require('fastclick')(document.body);

var assign = require('object-assign');
var createConfig = require('./config');
var createRenderer = require('./lib/createRenderer');
var palettes = require('./lib/color-palettes.json');
var createLoop = require('raf-loop');
var contrast = require('wcag-contrast');

var canvas = document.querySelector('#canvas');
var background = new window.Image();
var context = canvas.getContext('2d');

// color thief imported from dist
var colorThief = new ColorThief();
var loop = createLoop();

// DOM elements
var seedContainer = document.querySelector('.seed-container');
var seedText = document.querySelector('.seed-text');
var mapText = document.querySelector('.map-text');
var how2Text = document.querySelector('.howto');
var paletteOpt = document.querySelector('.palette-opt');
var coverall = document.querySelector('#coverall');

// toggle options
var isRandomPalette = false // to be defined by dropping an image
var droppedMapSrc = null // to be defined by dropping an image

var isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);

if (isIOS) { // iOS bugs with full screen ...
  const fixScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 500);
  };

  fixScroll();
  window.addEventListener('orientationchange', () => {
    fixScroll();
  }, false);
}

window.addEventListener('resize', resize);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
canvas.style.position = 'absolute';

var isLooping = false

var randomize = (ev) => {
  if (ev) ev.preventDefault();
  
  if (isLooping) {
    stopRandomize();
  } else {
    isLooping = !isLooping;
    reload(createConfig());
    how2Text.textContent = 'TAP TO STOP';
  }
};
randomize();
resize();

const addEvents = (element) => {
  element.addEventListener('mousedown', (ev) => {
    if (ev.button === 0) {
      randomize(ev);
    }
  });
  element.addEventListener('touchstart', randomize);
};

const targets = [ document.querySelector('#fill'), canvas ];
targets.forEach(t => addEvents(t));

function reload (config) {
  loop.removeAllListeners('tick');
  loop.stop();

  var opts = assign({
    backgroundImage: background,
    context: context
  }, config);

  var pixelRatio = typeof opts.pixelRatio === 'number' ? opts.pixelRatio : 1;
  canvas.width = opts.width * pixelRatio;
  canvas.height = opts.height * pixelRatio;

  seedText.textContent = opts.seedName;
  mapText.textContent = (droppedMapSrc && 'dropped file') || opts.backgroundSrc;

  background.onload = () => {  
    setPalette(opts)
    var renderer = createRenderer(opts);

    document.body.style.background = opts.palette[0];
    seedContainer.style.color = getBestContrast(opts.palette[0], opts.palette.slice(1));

    if (opts.debugLuma) {
      renderer.debugLuma();
    } else {
      renderer.clear();
      var stepCount = 0;
      loop.on('tick', () => {
        renderer.step(opts.interval);
        stepCount++;
        if (!opts.endlessBrowser && stepCount > opts.steps) {
          loop.stop();
        }
      });
      loop.start();
    }
  };

  background.src = droppedMapSrc || config.backgroundSrc;
  droppedMapSrc = null
}

function resize () {
  letterbox(canvas, [ window.innerWidth, window.innerHeight ]);
}

function getBestContrast (background, colors) {
  var bestContrastIdx = 0;
  var bestContrast = 0;
  colors.forEach((p, i) => {
    var ratio = contrast.hex(background, p);
    if (ratio > bestContrast) {
      bestContrast = ratio;
      bestContrastIdx = i;
    }
  });
  return colors[bestContrastIdx];
}

// resize and reposition canvas to form a letterbox view
function letterbox (element, parent) {
  var aspect = element.width / element.height;
  var pwidth = parent[0];
  var pheight = parent[1];

  var width = pwidth;
  var height = Math.round(width / aspect);
  var y = Math.floor(pheight - height) / 2;

  if (isIOS) { // Stupid iOS bug with full screen nav bars
    width += 1;
    height += 1;
  }

  element.style.top = y + 'px';
  element.style.width = width + 'px';
  element.style.height = height + 'px';
}


// Check palette option
paletteOpt.onclick = (evt) => {
  isRandomPalette = !isRandomPalette;
  paletteOpt.innerHTML = isRandomPalette;
  stopRandomize();
  randomize();
}

// Choose a palette based on image or randomize it
function setPalette (opts) {
  if (isRandomPalette) {
    var paletteColors = palettes[Math.floor(Math.random() * palettes.length)];
    opts.palette = arrayShuffle(paletteColors);
  } else {
    opts.palette = colorThief.getPalette(background, 5).map((colorBytes) => {
      return '#' + colorBytes.map((c) => c.toString(16)).join('');
    });
  }
}

// Allow drag and drop
window.addEventListener('dragenter', toggleCoverall);
window.addEventListener('dragenter', allowDrag);
window.addEventListener('dragover', allowDrag);
window.addEventListener('dragleave', toggleCoverall);

window.addEventListener('drop', function handleDrop(evt) {
  evt.preventDefault();

  var dt = evt.dataTransfer;
  var file = dt.files[0];
  var reader = new FileReader();
  // attach event handlers here...
  reader.addEventListener('loadend', function (evt) {
    droppedMapSrc = reader.result;
    toggleCoverall();
    stopRandomize();
    randomize();
  });
  reader.readAsDataURL(file);

  return false;
});

function stopRandomize () {
  loop.stop();
  isLooping = !isLooping;
  how2Text.textContent = 'TAP TO RANDOMIZE';
}

function allowDrag(evt) {
  evt.preventDefault();
}

function toggleCoverall () {
  if (coverall.style.opacity > 0) {
    coverall.style.opacity = 0;
    coverall.style.zIndex = -100;
  } else {
    coverall.style.opacity = 0.5;
    coverall.style.zIndex = 100;
  }
}

function arrayShuffle (arr) {
  var rand;
  var tmp;
  var len = arr.length;
  var ret = arr.slice();

  while (len) {
    rand = Math.floor(Math.random(1) * len--);
    tmp = ret[len];
    ret[len] = ret[rand];
    ret[rand] = tmp;
  }

  return ret;
}