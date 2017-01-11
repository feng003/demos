/**
 * Created by zhang on 2017/1/10.
 */

var arr = [1,21,34,2,45,67,'25',80,60,12];

function integerSort(arr)
{
    arr.sort(function(i,j){
        //console.log(i);
        return j-i;
    });
    return arr;
}
console.log(integerSort(arr));
