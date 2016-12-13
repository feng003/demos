/**
 * Created by zhang on 2016/12/12.
 */
"use strict";
const crypto = require('crypto');

//md5 sha1
/**
 * md5加密
 * @param str
 * @returns {*}
 */
function cryptoMd5(str){
    const hash = crypto.createHash('md5');
    //update()方法是将字符串相加
    hash.update(str);
    let rs = hash.digest('hex');
    return rs;
}

/**
 * hmac 加密
 * @param str
 * @param key
 * @returns {*}
 */
function cryptoHmac(str,key){
    //hmac
    const hmac = crypto.createHmac('sha256',key);
    hmac.update(str);
    let rs = hmac.digest('hex');
    return rs;
}

/**
 * 加密
 * @param data
 * @param key
 * @returns {*}
 */
function aesEncrypto(data,key){
    const cipher = crypto.createCipher('aes192',key);
    var   crypted = cipher.update(data,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * 解密
 * @param encrypted
 * @param key
 * @returns {*}
 */
function aesDecrypto(encrypted,key){
    const decipher = crypto.createDecipher('aes192',key);
    var decrypted = decipher.update(encrypted,'hex','utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//diffie-hellman
var ming = crypto.createDiffieHellman(512);
var ming_keys = ming.generateKeys();

var prime = ming.getPrime();
var generator = ming.getGenerator();

//console.log("Prime: " + prime);
//console.log('Generator: ' + generator);

var hong = crypto.createDiffieHellman(prime,generator);
var hong_keys = hong.generateKeys();

var ming_secret = ming.computeSecret(hong_keys);
var hong_secret = hong.computeSecret(ming_keys);

//每次输出都不一样，因为素数的选择是随机的
//console.log('Secret to Ming :' + ming_secret.toString('hex'));
//console.log('Secret to Hong :' + hong_secret.toString('hex'));

module.exports = {
    'cryptoMd5':cryptoMd5,
    'cryptoHmac':cryptoHmac,
    'aesEncrypto':aesEncrypto,
    'aesDecrypto':aesDecrypto
};