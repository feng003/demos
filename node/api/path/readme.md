> path


    path.join([path1], [path2], [...])    //连接所有参数, 并且规范化得到的路径。参数必须是字符串
    path.resolve([from ...], to)   //把to 解析为一个绝对路径。  把它看做一系列 cd 命令.
    accessSync() 同步读取一个路径
    path.relative(from, to) //破解从from到to的相对路径。

    path.dirname(p)          //返回路径中文件夹的名称 dirname()
    path.basename(p,[ext])  //返回路径中的最后一部分  basename()
    path.extname(p)         //返回路径中文件的扩展名
    path.isAbsolute(path)  //判定path是否为绝对路径
    path.sep               // '\\' '/'
    path.delimiter         // , ; 或 ':'


