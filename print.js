var createConfig = require('./config');
var createFileRenderer = require('./lib/createFileRenderer');

// do all that jazz
var seed = typeof process.argv[2] !== 'undefined'
  ? String(process.argv[2])
  : undefined;
var config = createConfig(seed);

createFileRenderer(config);
