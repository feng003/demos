> 问题一、Sessions with node.js / Express – TypeError: Cannot set property ‘X’ of undefined

    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));

    app.use(router);

It is important that app.use(app.router) is BELOW in your configuration function.


[参考文档](https://tanyanam.com/2012/06/28/sessions-with-node-js-express-typeerror-cannot-set-property-x-of-undefined/)
