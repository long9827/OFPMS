<?php
$action = $_GET['action'];
// echo $action;

if($action == "list") {
    //查询配肥配药
    $query = "select * from bom where 1=1  ";

    if(isset($_POST['number'])) {
        $number = $_POST['number'];
        $query .= "and number like '%$number%' ";
    }
    if(isset($_POST['bom_name'])) {
        $bom_name = $_POST['bom_name'];
        $query .= "and bom_name like '%$bom_name%' ";
    }
    if(isset($_POST['produce_date'])) {
        $produce_date = $_POST['produce_date'];
        $query .= "and produce_date like '%$produce_date%' ";
    }
    $query .= "order by 'produce_date'";
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "add") {
    // 新增
    if(isset($_POST['number']) && isset($_POST['produce_date']) && isset($_POST['bom_name']) 
            && isset($_POST['class']) && isset($_POST['labor_cost']) && isset($_POST['waste_rate'])) {
        $number = $_POST['number'];
        $produce_date = $_POST['produce_date'];
        $bom_name = $_POST['bom_name'];
        $class = $_POST['class'];
        $labor_cost = $_POST['labor_cost'];
        $waste_rate = $_POST['waste_rate'];
        $sql = "INSERT INTO bom(number, produce_date, bom_name, class, labor_cost, waste_rate)
            VALUES ('$number', '$produce_date', '$bom_name', $class, '$labor_cost', '$waste_rate');";
        // echo $query;
        include("../inc/mysql.php");
        $conn = new mysqlconn();
        if($conn->excu($sql)) {
            @$response->code = '0';
        } else {
            @$response->code = '-1';
            @$response->msg = "添加失败！";
        }
    } else {
        @$response->code = '-1';
        @$response->msg = "请输入！";
    }
    echo json_encode($response);
} elseif($action == "edit") {
    //修改肥料或农药信息
    $id = $_POST['id'];
    $number = $_POST['number'];
    $bom_name = $_POST['bom_name'];
    $class = $_POST['class'];
    $produce_date = $_POST['produce_date'];
    $labor_cost = $_POST['labor_cost'];
    $waste_rate = $_POST['waste_rate'];

    $sql = "UPDATE bom SET number='$number', bom_name='$bom_name', class=$class,
            produce_date='$produce_date', labor_cost='$labor_cost', waste_rate='$waste_rate'
            WHERE id=$id";
    // echo $sql;
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
    //删除
    $id = $_POST['id'];
    // echo $id;
    $sql_detail = "DELETE FROM bom_detail WHERE bom_id = $id";
    $sql = "DELETE FROM bom WHERE id = $id";
    // echo $sql_detail . " # " . $sql;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql_detail) && $conn->excu($sql)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);

} elseif($action == "list_detail") {
    //查询肥料或农药原料
    @$bom_id = $_POST['bom_id'];
    $query = "select * from bom_detail where bom_id = $bom_id";
    // echo $query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
} elseif($action == "addDetail") {
    //增加原料
    $bom_id = $_POST['bom_id'];
    $material_name = $_POST['material_name'];
    $material_wgt = $_POST['material_wgt'];
    $sql = "INSERT INTO bom_detail(bom_id, material_name, material_wgt)
            VALUES ($bom_id, '$material_name', $material_wgt);";
     // echo $query;
     include("../inc/mysql.php");
     $conn = new mysqlconn();
     if($conn->excu($sql)) {
         @$response->code = '0';
     } else {
         @$response->code = '-1';
         @$response->msg = "添加失败！";
     }
    echo json_encode($response);
} elseif($action == "editDetail") {
    //修改原料
    $id = $_POST['id'];
    $material_name = $_POST['material_name'];
    $material_wgt = $_POST['material_wgt'];
    $sql = "UPDATE bom_detail SET material_name = '$material_name', material_wgt = $material_wgt WHERE id = $id;";
     // echo $query;
     include("../inc/mysql.php");
     $conn = new mysqlconn();
     if($conn->excu($sql)) {
         @$response->code = '0';
     } else {
         @$response->code = '-1';
         @$response->msg = "修改失败！";
     }
    echo json_encode($response);
} elseif($action == "deleteDetail") {
    //删除原料
    $id = $_POST['id'];    
    $sql_detail = "DELETE FROM bom_detail WHERE id = $id";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($conn->excu($sql_detail)) {
        @$response->code = '0';
    } else {
        @$response->code = '-1';
        @$response->msg = "删除失败！";
    }
    echo json_encode($response);
}
?>