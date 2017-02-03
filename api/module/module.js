var name;

const PI = Math.PI;

exports.setName  = (theName) =>  name = theName;
exports.sayHello = () =>  console.log('Hello ' + name);
exports.area     = (r) => PI * r * r;
exports.circumference = (r) => 2 * PI * r;
