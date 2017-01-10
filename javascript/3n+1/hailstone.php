<?php
/**
 * Created by PhpStorm.
 * User: zhang
 * Date: 2017/1/10
 * Time: 8:22
 */
/**
 * 3n+1 问题
 * @param $n
 * @return array
 */
function hailstone($n){
    $arr = [];
    $num = 1;
    while(1<$n){
//        echo $n."#";
        array_push($arr,$n);
        $n = ($n%2) ? (3*$n+1) : ($n/2);
        $num++;
    }
    return $arr;
}
print_r(hailstone(49));