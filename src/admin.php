<?php
$action = $_GET['action'];
// echo $action;
@session_start();
if($action == "addAuth") {
    $auth = $_POST['auth'];
    
    $sql = "INSERT INTO authority(name)
            VALUES ('$auth');";
    // echo $sql;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "添加失败！";
    }
    echo json_encode($response);
} elseif($action == "list") {
    $query = "select * from permission ";
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "delete") {
    $id = $_POST['id'];
    $sql = "DELETE FROM permission WHERE id = $id ";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
} elseif($action == "auths") {
    $query = "SELECT * FROM authority";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    $identity = $_POST['identity'];
    $auth_id = $_POST['auth_id'];
    $auth_name = $_POST['auth_name'];
    $sql = "INSERT INTO permission(identity, auth_id, auth_name)
                    VALUES ($identity, $auth_id, '$auth_name')";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "添加失败！";
    }
    echo json_encode($response);
}
?>