const CryptoJS = require('crypto-js');  //引用AES源码js
let config = require('./config.js')
const key = CryptoJS.enc.Utf8.parse(config.key);  //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse(config.iv);   //十六位十六进制数作为密钥偏移量

//解密方法
function Decrypt(word) {
  let abc = word.slice(0,16);
  let iv = CryptoJS.enc.Utf8.parse(abc);
  let temp = word.slice(16);
  let decrypt = CryptoJS.AES.decrypt(temp, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//加密方法
function Encrypt(word,token) {
  let abc = token.slice(-16);
  let iv = CryptoJS.enc.Utf8.parse(abc);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  let hexStr = encrypted.ciphertext.toString().toUpperCase();
  let oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  return abc+CryptoJS.enc.Base64.stringify(oldHexStr);
}

export default {
  Decrypt,Encrypt
}
