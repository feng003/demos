<?php
/**
 * Created by PhpStorm.
 * User: zhang
 * Date: 2016/1/29
 * Time: 9:35
 */

var_dump($_REQUEST);
$res = json_encode($_REQUEST);
header('Content-type: application/json');
print_r($res);
