> Query String


> querystring.stringify(obj, [sep], [eq])  序列化一个对象到一个 query string。可以选择是否覆盖默认的分割符（'&'）和分配符（'='）


    querystring.stringify({foo: 'bar', baz: 'qux'}, ';', ':')
    // 返回如下字串
    'foo:bar;baz:qux'

> querystring.parse(str, [sep], [eq], [options]) 将一个 query string 反序列化为一个对象。可以选择是否覆盖默认的分割符（'&'）和分配符（'='）

    querystring.parse('foo=bar&baz=qux&baz=quux&corge')
    // returns
    { foo: 'bar', baz: ['qux', 'quux'], corge: '' }

> querystring.escape

> querystring.unescape