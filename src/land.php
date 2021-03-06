<?php
$action = $_GET['action'];
// echo $action;

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
    if(isset($_POST['tech_name']) && $_POST['tech_name'] != '') {
        $tech_name = $_POST['tech_name'];
        $query .= "and tech_name like '%$tech_name%' ";
    }
    if(isset($_POST['status']) && $_POST['status'] != '2') {
        $status = $_POST['status'];
        $query .= "and status = $status ";
    }
    $query .= "order by 'region'";
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    // 新增土地
    $region = $_POST['region'];
    $landmark = $_POST['landmark'];
    $block = $_POST['block'];
    $location = $_POST['location'];
    $area = $_POST['area']=='' ? 0 : $_POST['area'];
    $status = $_POST['status'];
    $tech_name = $_POST['tech'];

    if($region!='') {
        $sql = "INSERT INTO land(region, landmark, block, location, area, status, tech_name)
            VALUES ('$region', '$landmark', '$block', '$location', $area, $status, '$tech_name')";
        include("../inc/mysql.php");
        $conn = new mysqlconn();
        if($conn->excu($sql)) {
            @$response->code = '0';
        } else {
            @$response->code = '-1';
            @$response->msg = "该地位已存在！";
        }
    } else {
        @$response->code = '-1';
        @$response->msg = "请输入！";
    }
    echo json_encode($response);
} elseif($action == "edit") {
    //修改土地
    $land_id = $_POST['land_id'];
    $region = $_POST['region'];
    $landmark = $_POST['landmark'];
    $block = $_POST['block'];
    $location = $_POST['location'];
    $area = $_POST['area']=='' ? 0 : $_POST['area'];
    $status = $_POST['status'];
    $tech_name = $_POST['tech'];

    $sql = "UPDATE land SET region='$region', landmark='$landmark', block='$block', 
            location='$location', area=$area, status=$status, tech_name='$tech_name' 
            WHERE land_id=$land_id";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "修该失败！";
    }
    echo json_encode($response);
} elseif($action == "delete") {
    //删除土地
    $land_id = $_POST['land_id'];
    $sql = "DELETE FROM land WHERE land_id = $land_id";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
} 

?>