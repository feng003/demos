
> node模块

    http
    url
    querystring

    http://localhost:8888/start?foo=bar&hello=world

    url.parse(string).pathname   // start

    url.parse(string).query  //  ?foo=bar&hello=world

    querystring(string)["foo"]   // bar
    querystring(string)["hello"]  // world

> 上传图片过程中，调用fs.renameSync报错：（Error: EXDEV, cross-device link not permitted）

    1. 利用fs的createReadStream、createWriteSream和unlinkSync方法

    util.pump(readStream,writeStream, function() {
        fs.unlinkSync('files.upload.path');
    });

    2. form.uploadDir = 'tmp'  （临时路径）
