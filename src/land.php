<?php
$action = $_GET['action'];

if($action == "list") {
    //查询土地
    $query = "select * from land where 1=1  ";

    if(isset($_POST['region'])) {
        $region = $_POST['region'];
        $query .= "and region like '%$region%' ";
    }
    if(isset($_POST['landmark'])) {
        $landmark = $_POST['landmark'];
        $query .= "and landmark like '%$landmark%' ";
    }
    if(isset($_POST['block'])) {
        $block = $_POST['block'];
        $query .= "and block like '%$block%' ";
    }
    if(isset($_POST['location'])) {
        $location = $_POST['location'];
        $query .= "and location like '%$location%' ";
    }
    $query .= "order by land_id";
    include("../inc/mysql.php");
    $sql = new mysqlconn();
    $rows = $sql->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    //新增土地
    // $response[] = array();
    @$response->code = '-1';
    @$response->msg = 'unknon error';
    echo json_encode($response);
} elseif($action == "edit") {
    //修改土地
    @$response->code = '-1';
    @$response->msg = 'unknon error; lnad_id: ' .$_POST['land_id'] ;
    echo json_encode($response);
} elseif($action == "delete") {
    //删除土地
    @$response->code = '-1';
    @$response->msg = '删除 lnad_id: ' .$_POST['land_id'] ;
    echo json_encode($response);
} 


?>