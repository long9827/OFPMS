<?php
$action = $_GET['action'];
// echo $action;
@session_start();
if($action == "list") {
    $query = "SELECT farm.*, CONCAT( region, '-', landmark, '-', block, '-', location ) AS land_name,
                        user.username as tech_name FROM farm
                        LEFT JOIN land ON farm.land_id = land.land_id
                        LEFT JOIN user ON farm.tech_id = user.user_id
                        WHERE 1 = 1 ";
if(isset($_POST['number'])) {
    $number = $_POST['number'];
    $query .= "and number like '%$number%' ";
}
if(isset($_POST['farm_date'])) {
    $farm_date = $_POST['farm_date'];
    $query .= "and farm_date like '%$farm_date%' ";
}
if(isset($_POST['farm_name'])) {
    $farm_name = $_POST['farm_name'];
    $query .= "and farm_name like '%$farm_name%' ";
}
// echo $query;
include("../inc/mysql.php");
$conn = new mysqlconn();
$rows = $conn->excu_json($query);
echo json_encode($rows);
    
} elseif($action == "add") {
    // 添加农作记录
    $number = $_POST['number'];
    $farm_date = $_POST['farm_date'];
    $land_id = $_POST['land_id'];
    $labor_cost = $_POST['labor_cost'];
    $farm_name = $_POST['farm_name'];
    $bom_name = $_POST['bom_name'];
    $amount = $_POST['amount'];
    $class = $_POST['class'];

    $tech_id = $_SESSION['userid'];
    $sql = "INSERT INTO farm(number, farm_date, land_id, labor_cost, farm_name, bom_name, amount, class, tech_id)
            VALUES ('$number', '$farm_date', $land_id, $labor_cost, '$farm_name', '$bom_name', $amount, $class, $tech_id);";
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
   
} elseif($action == "edit") {
    //修改农作记录
    $id = $_POST['id'];
    
    $number = $_POST['number'];
    $farm_date = $_POST['farm_date'];
    $land_id = $_POST['land_id'];
    $labor_cost = $_POST['labor_cost'];
    $farm_name = $_POST['farm_name'];
    $bom_name = $_POST['bom_name'];
    $amount = $_POST['amount'];
    $class = $_POST['class'];
    
    $sql = "UPDATE farm SET number='$number', farm_date='$farm_date', land_id=$land_id, labor_cost=$labor_cost,
                    farm_name='$farm_name', bom_name='$bom_name', amount=$amount, class=$class WHERE id=$id;";
    // echo $sql;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "修改失败！";
    }
    echo json_encode($response);
} elseif($action == "delete") {
    //删除农作记录
    $id = $_POST['id'];
    $sql = "DELETE FROM farm WHERE id = $id";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
} elseif($action == "bom_name") {
    $class = $_POST['class'];
    if($class == 0) {
        //种子
        $query = "SELECT DISTINCT material_name as name FROM purchase WHERE class= 0;";
    } elseif($class == 3) {
        //农药
        $query = "SELECT DISTINCT bom_name as name FROM bom WHERE class = 3";
    } else {
        //肥料
        $query = "SELECT DISTINCT bom_name as name FROM bom WHERE class = 4";
    }
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
}

?>