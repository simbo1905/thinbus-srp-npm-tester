(function() {
  var alphabet, bufferToAlphabet, crypto, random;

  crypto = require('crypto');

  module.exports.alphabet = alphabet = {
    alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    alphaLower: 'abcdefghijklmnopqrstuvwxyz',
    alphaMixed: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    alphaNumUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    alphaNumLower: 'abcdefghijklmnopqrstuvwxyz0123456789',
    alphaNumMixed: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    human: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    numeric: '0123456789',
    hex: '0123456789ABCDEF',
    base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    newBase64: '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz-+*$'
  };

  module.exports.bufferToAlphabet = bufferToAlphabet = function(buffer, alphabet) {
    var i, remainder, result, value;
    result = "";
    i = 0;
    while (i < buffer.length) {
      value = buffer[i];
      while (true) {
        remainder = value % alphabet.length;
        result += alphabet[remainder];
        value = (value - remainder) / alphabet.length;
        if (!(value > 0)) {
          break;
        }
      }
      i++;
    }
    return result;
  };

  module.exports.random = random = function(maxLength, inAlphabet) {
    var i, randomBytes, readBytes;
    inAlphabet = inAlphabet != null ? inAlphabet : alphabet.base64;
    randomBytes = new Buffer(0);
    while (randomBytes.length < maxLength) {
      readBytes = crypto.pseudoRandomBytes(maxLength - randomBytes.length);
      randomBytes = Buffer.concat([randomBytes, readBytes]);
    }
    i = 0;
    return (bufferToAlphabet(randomBytes, inAlphabet)).substr(1, maxLength);
  };

  module.exports.alphaUpper = function(maxLength) {
    return random(maxLength, alphabet.alphaUpper);
  };

  module.exports.alphaLower = function(maxLength) {
    return random(maxLength, alphabet.alphaLower);
  };

  module.exports.alphaMixed = function(maxLength) {
    return random(maxLength, alphabet.alphaMixed);
  };

  module.exports.alphaNumUpper = function(maxLength) {
    return random(maxLength, alphabet.alphaNumUpper);
  };

  module.exports.alphaNumLower = function(maxLength) {
    return random(maxLength, alphabet.alphaNumLower);
  };

  module.exports.alphaNumMixed = function(maxLength) {
    return random(maxLength, alphabet.alphaNumMixed);
  };

  module.exports.human = function(maxLength) {
    return random(maxLength, alphabet.human);
  };

  module.exports.numeric = function(maxLength) {
    return random(maxLength, alphabet.numeric);
  };

  module.exports.hex = function(maxLength) {
    return random(maxLength, alphabet.hex);
  };

  module.exports.newBase64 = function(maxLength) {
    return random(maxLength, alphabet.newBase64);
  };

  module.exports.base64 = function(maxLength) {
    return random(maxLength, alphabet.base64);
  };

}).call(this);
