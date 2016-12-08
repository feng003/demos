module.exports = {
  "app":8880,
  "session":{
    "secret":"keyboard",   //用来对session数据进行加密的字符串
    "resave":false,
    "saveUninitialized":true,
    "cookie":{ "secure":true,"maxAge":6000}
  },
  "mongo":{
    "host":"127.0.0.1",
    "port":27017,
    "db":"user",
    "max":10,
    "min":1,
    "timeout":360000
  }
};