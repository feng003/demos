/**
 * Created by User on 2017/10/9.
 */
const fs      = require('fs');
const http    = require('http');
const https   = require('https');
const request = require('request');
const fetch = require('node-fetch');

function getData(isbn) {
    getDataFromDoubanApi(isbn);
}

function getDataFromDoubanApi(isbn) {
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

const sleep = (timeout = 2000) => new Promise(resolve => {
  setTimeout(resolve, timeout);
});

async function getBookByDouban(isbn){
    const url = "https://api.douban.com/v2/book/isbn/"+isbn;
    sleep();
    const response = await fetch(url);
    if(response.status !== 200){
      throw new Error(response.statusText);
    }
    const info = await response.json();
    // const info = await JSON.stringify(response);
    fs.appendFile('./log.txt', JSON.stringify(info)+"\r\n",function (err) {
        if(err) throw err;
    });
}

const getInfo = async function(){
    console.time('get info');
    const arr = ['9787010000000','9787020000000','9787060000000','9787040000000'];
    const promises = arr.map(function(x){getBookByDouban(x);});
    for (const promise of promises){
        const info = await promise;
    }
    console.timeEnd('get info');
}
getInfo();

// getBookByDouban(9787010000000)
//   .then(function(){
//     getBookByDouban(9787020000000)
//   });

// getData(9787010000000);