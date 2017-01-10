/**
 * Created by zhang on 2017/1/10.
 */

/**
 * 3n+1 问题
 * @param n
 * @returns {Array}
 */
function hilostone(n)
{
    var arr = [];
    while(1<n)
    {
        arr.push(n);
        n = (n%2)?(3*n+1):(n/2);
    }
    return arr;
}

console.log(hilostone(3));
