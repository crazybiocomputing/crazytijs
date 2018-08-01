// From https://stackoverflow.com/questions/13488957/interpolate-from-one-color-to-another
/** Main */
var red        = { r : 255, g : 0,   b : 0 };
var green      = { r : 0,   g : 255, b : 0 };
var yellow     = interpolateHsv(red, green, 0.5, linear);
var darkYellow = interpolateRgb(red, green, 0.5, linear);

document.body.innerHTML =
  'Yellow: '      + JSON.stringify(yellow,     null, '  ') + '<br />' +
  'Dark Yellow: ' + JSON.stringify(darkYellow, null, '  ');

/**
 * Returns an HSV interpolated value between two rgb values. 
 *
 * @param {Object} rgbA - rgb() tuple
 * @param {Object} rgbB - rgb() tuple
 * @param {Number} threshold - float between [0.0, 1.0]
 * @param {function} interpolatorFn - interpolator function
 * @return {Object} rbg
 */
function interpolateHsv(rgbA, rgbB, threshold, interpolatorFn) {
  var hsvA = rgbToHsv(rgbA);
  var hsvB = rgbToHsv(rgbB);
  threshold = toArray(threshold, 3);
  return hsvToRgb({
    h : interpolatorFn(hsvA.h, hsvB.h, threshold[0]),
    s : interpolatorFn(hsvA.s, hsvB.s, threshold[1]),
    v : interpolatorFn(hsvA.v, hsvB.v, threshold[2])
  });
}

/**
 * Returns an RGB interpolated value between two rgb values. 
 *
 * @param {Object} rgbA - rgb() tuple
 * @param {Object} rgbB - rgb() tuple
 * @param {Number} threshold - float between [0.0, 1.0]
 * @param {function} interpolatorFn - interpolator function
 * @return {Object} rbg
 */
function interpolateRgb(rgbA, rgbB, threshold, interpolatorFn) {        
  threshold = toArray(threshold, 3);
  return {
    r : ~~interpolatorFn(rgbA.r, rgbB.r, threshold[0]),
    g : ~~interpolatorFn(rgbA.g, rgbB.g, threshold[1]),
    b : ~~interpolatorFn(rgbA.b, rgbB.b, threshold[2])
  };
}

/**
 * Returns an interpolated value between two values. 
 *
 * @param {Number} valueA - color channel int value
 * @param {Number} valueB - color channel int value
 * @param {Number} threshold - float between [0.0, 1.0]
 * @param {function} interpolatorFn - interpolator function
 * @return {int}
 */
function linear(valueA, valueB, threshold) {
  return valueA * (1 - threshold) + valueB * threshold;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param {Object} rgb - Color in rgb mode
 * @return {Object} - Color in hsv mode
 */
function rgbToHsv(rgb) {
  var r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h : h,
    s : s,
    v : v
  };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param {Object} hsv - Color in hsv mode
 * @return {Object} - Color in rgb mode
 */
function hsvToRgb(hsv){
  var r, g, b, i, f, p, q, t,
      h = hsv.h,
      s = hsv.s,
      v = hsv.v;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch(i % 6){
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r : r * 255,
    g : g * 255,
    b : b * 255
  };
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function toArray(arr, size) {
  var isNum = isNumeric(arr);
  arr = !Array.isArray(arr) ? [arr] : arr;
  for (var i = 1; i < size; i++) {
    if (arr.length < size) {
      arr.push(isNum ? arr[0] : 0);
    }
  }
  return arr;
}
