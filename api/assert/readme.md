/**
 * Created by zhang on 2016/7/18.
 */

assert();
assert(value, message)

assert.equal(actual, expected, [message])
assert.notEqual(actual, expected, [message])

assert.deepEqual() 比较两个对象。只要它们的属性一一对应，且值都相等，就认为两个对象相等
assert.deepEqual(actual, expected, [message])
assert.notDeepEqual(actual, expected, [message])

assert.strictEqual()  严格相等运算符（===），比较两个表达式。
assert.strictEqual(actual, expected, [message])
assert.notStrictEqual(actual, expected, [message])

assert.throws() 预期某个代码块会抛出一个错误，且抛出的错误符合指定的条件。
assert.throws(block, [error], [message])
assert.doesNotThrow(block, [message])

assert.ifError(value) 断言某个表达式是否false，如果该表达式对应的布尔值等于true，就抛出一个错误。它对于验证回调函数的第一个参数十分有用，如果该参数为true，就表示有错误。

assert.fail() 抛出一个错误。
assert.fail(actual, expected, message, operator)



