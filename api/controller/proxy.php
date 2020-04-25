<?php

/*
 * proxy BE controller to handle API requests unsupported by the FE, due to no CORS headers
 */

$config = include('../config/configs.php');
$endpoint = str_replace("get=", "", $_SERVER['QUERY_STRING']);

header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $config->api . $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
$error = curl_error ($ch);
curl_close($ch);

echo $output;

?>