<?php
/**
 * Created by PhpStorm.
 * User: zhang
 * Date: 2017/1/10
 * Time: 21:52
 */

function p($arr){
    echo "<pre>";
    print_r($arr);
    echo '</pre>';
}

/**
 * 选择排序
 * @param array $arr
 */
function integerSort(array $arr)
{
    // 需要遍历获得最小值的次数
    // 要注意一点，当要排序 N 个数，已经经过 N-1 次遍历后，已经是有序数列
    $length = count($arr);
    for($i = 0; $i<$length-1;$i++)
    {
        $temp  = 0; // 临时空间
        $index = $i; // 用来保存最小值得索引
        // 寻找第i个小的数值
        for($j = $i+1;$j<$length;$j++)
        {
            if($arr[$index] > $arr[$j])
            {
                $index = $j;
            }
        }
        echo $index;
        // 将找到的第i个小的数值放在第i个位置上
        $temp = $arr[$index];
        $arr[$index] = $arr[$i];
        $arr[$i] = $temp;
        p($arr);
    }
//    print_r($arr);
}

integerSort([1,21,34,2,45,67,25,80,60,12]);