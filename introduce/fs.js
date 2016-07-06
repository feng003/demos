var fs = require('fs');

function copy(src,dst){
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(arg){
    copy(arg[0],arg[1]);
}

main(process.arg.slice(2));
