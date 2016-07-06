>  mongo 运行报错 ： [thread1] Failed to connect to 127.0.0.1:27017, reason: errno:111 Connection refused

    原因是mongodb的服务没有开启，开启服务后问题就能解决。
    开启服务命令： mongod --dbpath  /data/db(保存路径)

> node and mongo






[官方教程](https://docs.mongodb.com/getting-started/node/client/)
