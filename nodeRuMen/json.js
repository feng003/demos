var obj = {   
    "name": "LiLi",  
    "age": 22,   
    "sex": "F"   
};  
//object to string
var str = JSON.stringify(obj);  
console.log(str);  

//string to object
var obj2 = JSON.parse(str);  
console.log(obj2);  
