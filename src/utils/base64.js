let Base64 = require('js-base64').Base64;


function encode(str) {
  return Base64.encode(str)
}

function decode(str) {
  return Base64.decode(str)
}

export default {
  encode,decode
}
