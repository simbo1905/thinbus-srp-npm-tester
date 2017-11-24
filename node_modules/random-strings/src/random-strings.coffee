crypto = require 'crypto'

module.exports.alphabet = alphabet = 
  alphaUpper    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  alphaLower    : 'abcdefghijklmnopqrstuvwxyz'
  alphaMixed    : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  alphaNumUpper : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  alphaNumLower : 'abcdefghijklmnopqrstuvwxyz0123456789'
  alphaNumMixed : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  human         : 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  numeric       : '0123456789'
  hex           : '0123456789ABCDEF'
  base64        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  newBase64     : '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz-+*$'

module.exports.bufferToAlphabet = bufferToAlphabet = (buffer, alphabet) ->
  result = ""
  i = 0
  while i < buffer.length
    value = buffer[i]
    loop # oh, coffeescript.
      remainder = value % alphabet.length
      result += alphabet[remainder]
      value = (value - remainder) / alphabet.length
      break unless value > 0 # you make me feel ugly.
    i++
  result


module.exports.random = random = (maxLength, inAlphabet)->
	inAlphabet = inAlphabet ? alphabet.base64

	randomBytes = new Buffer(0)
	while randomBytes.length < maxLength
		readBytes = crypto.pseudoRandomBytes maxLength-randomBytes.length
		randomBytes = Buffer.concat [randomBytes,readBytes]
	i=0
	return (bufferToAlphabet randomBytes, inAlphabet).substr 1,maxLength

module.exports.alphaUpper = (maxLength)->
  random(maxLength, alphabet.alphaUpper)

module.exports.alphaLower = (maxLength)->
  random(maxLength, alphabet.alphaLower)

module.exports.alphaMixed = (maxLength)->
  random(maxLength, alphabet.alphaMixed)

module.exports.alphaNumUpper = (maxLength)->
  random(maxLength, alphabet.alphaNumUpper)

module.exports.alphaNumLower = (maxLength)->
  random(maxLength, alphabet.alphaNumLower)

module.exports.alphaNumMixed = (maxLength)->
  random(maxLength, alphabet.alphaNumMixed)

module.exports.human = (maxLength)->
  random(maxLength, alphabet.human)

module.exports.numeric = (maxLength)->
  random(maxLength, alphabet.numeric)

module.exports.hex = (maxLength)->
  random(maxLength, alphabet.hex)
  
module.exports.newBase64 = (maxLength)->
  random(maxLength, alphabet.newBase64)

module.exports.base64 = (maxLength)->
  random(maxLength, alphabet.base64)
