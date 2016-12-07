> 服务器端 可以接受网络请求、读写文件、处理二进制内容

        global
            global.console
        
        process
            process.version;
            process.cwd();
            
        fs
            open();
            readFile();
            readFileSync();    
            writeFile();
            exists();
            mkdir();
            readdir();
            rmdir()
            stat(); 获取文件大小以及创建时间
            createReadStream(); 创建一个读取操作的数据流
            createWriteStream(); 创建一个写入数据流对象 write()写入数据，end()结束操作
            unlink();
            ftruncate(resource fd,len,callback);截取文件
            
        buffer and string 
            buffer=>string var text = data.toString('utf-8');
            string=>buffer var buf = new Buffer(text,'utf-8');
        
        