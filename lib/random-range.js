module.exports = function (randFunc) {
  return function random (min, max) {
    if (typeof min === 'undefined') {
      min = 1;
    }
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    return randFunc() * (max - min) + min;
  };
};
