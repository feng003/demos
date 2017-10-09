/**
 * Created by User on 2017/10/9.
 */
const fs      = require('fs');
const http    = require('http');
const https   = require('https');
const request = require('request');

function getData(isbn)
{
    getDataFromDoubanApi(isbn);
}

function getDataFromDoubanApi(isbn)
{
    const options = {
        hostname: 'api.douban.com',
        path: '/v2/book/isbn/'+isbn,
        method: 'GET'
    };

    var data = [];
    https.request(options, function(res)
    {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            let info = JSON.parse(chunk);
            if(info['code']){
                fs.appendFile('./code.txt', isbn+"###"+chunk+"\r\n", (err) => {
                    if (err) throw err;
                });
                // const rs = record.addData(isbn,info['code']);
            }else{
                // const rs = book.addData(info);
                fs.writeFile('./'+isbn+'.txt', chunk, (err) => {
                    if (err) throw err;
                });
            }
        });
        res.on('end',function(){
            console.log(isbn);
            if(isbn < '9787010000050') {
                isbn = isbn+10;
                getData(isbn);
            }
        })
    }).on('error', function(err) {
        throw new Error(err);
    }).end();
}

getData(9787010000000);