<?php
$action = $_GET['action'];
// echo $action;
@session_start();
if($action == "list") {
    $query = "SELECT plan.*, CONCAT( region, '-', landmark, '-', block, '-', location ) AS land_name,
                        user.username as tech_name FROM plan
                        LEFT JOIN land ON plan.land_id = land.land_id
                        LEFT JOIN user ON plan.tech_id = user.user_id
                        WHERE 1 = 1 ";
    if(isset($_POST['number'])) {
        $number = $_POST['number'];
        $query .= "and number like '%$number%' ";
    }
    if(isset($_POST['vgt_name'])) {
        $vgt_name = $_POST['vgt_name'];
        $query .= "and vgt_name like '%$vgt_name%' ";
    }
    if(isset($_POST['sow_date'])) {
        $sow_date = $_POST['sow_date'];
        $query .= "and sow_date like '%$sow_date%' ";
    }
    if(isset($_POST['status']) && $_POST['status']!='2') {
        $status = $_POST['status'];
        $query .= "and plan.status = $status ";
    }
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    // 添加计划
    $number = $_POST['number'];
    $vgt_name = $_POST['vgt_name'];
    $sow_date = $_POST['sow_date'];
    $land_id = $_POST['land_id'];
    $list_date = $_POST['list_date'];
    $list_harvest_wgt = $_POST['list_harvest_wgt'];
    $peak_date = $_POST['peak_date'];
    $peak_harvest_wgt = $_POST['peak_harvest_wgt'];
    $delist_date = $_POST['delist_date'];
    $make_date = date("Ymd", time());
    $tech_id = $_SESSION['userid'];
    $sql = "INSERT INTO plan(number, vgt_name, make_date, sow_date, land_id, list_date, list_harvest_wgt, peak_date, peak_harvest_wgt, delist_date, tech_id)
            VALUES ('$number', '$vgt_name', $make_date, $sow_date, $land_id, $list_date, $list_harvest_wgt, $peak_date, $peak_harvest_wgt, $delist_date, $tech_id);";
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
    // 修改计划
    $id = $_POST['id'];
    $number = $_POST['number'];
    $vgt_name = $_POST['vgt_name'];
    $sow_date = $_POST['sow_date'];
    $land_id = $_POST['land_id'];
    $list_date = $_POST['list_date'];
    $list_harvest_wgt = $_POST['list_harvest_wgt'];
    $peak_date = $_POST['peak_date'];
    $peak_harvest_wgt = $_POST['peak_harvest_wgt'];
    $delist_date = $_POST['delist_date'];
    // $make_date = date("Ymd", time());
    // $tech_id = $_SESSION['userid'];
    $sql = "UPDATE plan SET number='$number', vgt_name='$vgt_name', sow_date='$sow_date', land_id=$land_id,
                    list_date='$list_date', list_harvest_wgt=$list_harvest_wgt, peak_date='$peak_date', peak_harvest_wgt=$peak_harvest_wgt, delist_date='$delist_date' WHERE id=$id;";
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
    //删除计划
    $id = $_POST['id'];
    $sql1 = "DELETE FROM stop_plan WHERE plan_id = $id";
    $sql2 = "DELETE FROM plan WHERE id = $id";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql1) && $conn->excu($sql2)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
} elseif($action == "stop") {
    //中止计划
    $id = $_POST['id'];
    $number = $_POST['number'];
    $stop_date = $_POST['stop_date'];
    $reason = $_POST['reason'];
    $sql_plan = "UPDATE plan SET status=0 WHERE id=$id;";
    $sql_stop = "INSERT INTO stop_plan(plan_id, number, stop_date, reason)
                            VALUES ($id, '$number', '$stop_date', '$reason');";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql_plan) && $conn->excu($sql_stop)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
} elseif($action == "showStop") {
    $id = $_POST['id'];
    $query = "select * from stop_plan where plan_id=$id limit 1;";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "vegetables") {
    $query = "SELECT DISTINCT material_name FROM purchase WHERE class= 0;";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "lands") {
    if($_SESSION['identity']==2) {
        $tech_id = $_SESSION['userid'];
        $query = "SELECT CONCAT(region,'-',landmark, '-', block, '-', location) as name, land_id from land WHERE tech_id = $tech_id order by name;";
        include("../inc/mysql.php");
        $conn = new mysqlconn();
        $rows = $conn->excu_json($query);
        echo json_encode($rows);
    }
}

?>