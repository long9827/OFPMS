<?php
$action = $_GET['action'];
// echo $action;

if($action == "permission") {
    //查询权限
    @session_start();
    $identity = $_SESSION['identity'];
    $query = "select auth_name from permission where identity = $identity;";

    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} 
?>