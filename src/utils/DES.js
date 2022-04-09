import cryptoJs from "crypto-js";
/**
  * 
  * 第一个参数word是待加密或者解密的字符串；
  * 第二个参数keyStr是aes加密需要用到的16位字符串的key；
  * 第三个参数是初始化向量 iv。
  */
export default {
  // 加密
  encrypt(word, keyStr, ivStr) {
    keyStr = keyStr ? keyStr : "E4BF2A91421A4584A88ADE5BBAD10FD2";
    ivStr = ivStr ? ivStr : "61960842";
    let keyHex = cryptoJs.enc.Utf8.parse(keyStr)
    let ivHex = cryptoJs.enc.Utf8.parse(ivStr)
    var option = { iv: ivHex, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 }
    var encrypted = cryptoJs.DES.encrypt(word, keyHex, option)
    // console.log('加密',encrypted.toString())
    return encrypted.toString()
  },
  // 解密
  decrypt(message, keyStr, ivStr) {
    keyStr = keyStr ? keyStr : "E4BF2A91421A4584A88ADE5BBAD10FD2";
    ivStr = ivStr ? ivStr : "61960842";
    let keyHex = cryptoJs.enc.Utf8.parse(keyStr)
    let ivHex = cryptoJs.enc.Utf8.parse(ivStr)
    let ciphertext = cryptoJs.enc.Base64.parse(message);
    let decrypted = cryptoJs.DES.decrypt(
     {ciphertext},
      keyHex,
      {
        iv: ivHex,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
      }
    )
    return decrypted.toString(cryptoJs.enc.Utf8)
  }
};