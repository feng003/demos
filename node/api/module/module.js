var name;

exports.setName = function(theName){
    name = theName;
};

exports.sayHello = function(){
    console.log('Hello ' + name);
};
