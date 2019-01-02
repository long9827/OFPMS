<?php
$action = $_GET['action'];
// echo $action;

if($action == "list") {
    //查询生产材料购置记录
    $query = "select * from purchase where 1=1  ";

    if(isset($_POST['number'])) {
        $number = $_POST['number'];
        $query .= "and number like '%$number%' ";
    }
    if(isset($_POST['buy_date'])) {
        $buy_date = $_POST['buy_date'];
        $query .= "and buy_date like '%$buy_date%' ";
    }
    if(isset($_POST['material_name'])) {
        $material_name = $_POST['material_name'];
        $query .= "and material_name like '%$material_name%' ";
    }
    if(isset($_POST['class']) && $_POST['class']!='2') {
        $class = $_POST['class'];
        $query .= "and class like '%$class%' ";
    }
    $query .= "order by 'number'";
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    // 新增购置记录
    $number = $_POST['number'];
    $buy_date = $_POST['buy_date'];
    $material_name = $_POST['material_name'];
    $amount = $_POST['amount'];
    $uint_price = $_POST['unit_price'];
    $class = $_POST['class'];
    $note = isset($_POST['note']) ? $_POST['note'] : '';
    $sql = "INSERT INTO purchase(number, buy_date, material_name, amount, unit_price, class, note)
        VALUES ('$number', $buy_date, '$material_name', '$amount', $uint_price, $class, '$note');";
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
    //修改记录
    $id = $_POST['id'];
    $number = $_POST['number'];
    $buy_date = $_POST['buy_date'];
    $material_name = $_POST['material_name'];
    $amount = $_POST['amount'];
    $uint_price = $_POST['unit_price'];
    $class = $_POST['class'];
    $note = $_POST['note'];
    $sql = "UPDATE purchase SET number='$number', buy_date='$buy_date', material_name='$material_name', 
        amount='$amount', unit_price=$uint_price, class=$class, note='$note' WHERE id = $id;";
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
    //删除记录
    $id = $_POST['id'];
    $sql = "DELETE FROM purchase WHERE id = $id";
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