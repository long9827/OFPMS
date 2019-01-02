<?php
$action = $_GET['action'];
// echo $action;

@session_start();
if($action == "list") {
    //查询土地
    // $query = "select * from land where 1=1  ";
    if($_SESSION['identity']==2) {
        //技术人员
        $tech_id = $_SESSION['userid'];
        $query = "from land where tech_id=$tech_id  ";
    } else {
        $query = "from land where 1=1  ";
    }

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
    if(isset($_POST['tech_id']) && $_POST['tech_id'] != '') {
        $tech_id = $_POST['tech_id'];
        $query .= "and tech_id like '%$tech_id%' ";
    }
    if(isset($_POST['status']) && $_POST['status'] != '2') {
        $status = $_POST['status'];
        $query .= "and status = $status ";
    }
    $query .= "order by region";
    // echo $query;
    $queryArea = "select sum(area) as sum " . $query;
    $query = "select * " .$query;
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    $area = $conn->excu_json($queryArea);
    $rows[0]['sum_area'] = $area[0]['sum'];
    echo json_encode($rows);
} elseif($action == "add") {
    // 新增土地
    $region = $_POST['region'];
    $landmark = $_POST['landmark'];
    $block = $_POST['block'];
    $location = $_POST['location'];
    $area = $_POST['area']=='' ? 0 : $_POST['area'];
    $status = $_POST['status'];
    $tech_id = $_POST['tech_id'];
    // $tech_name = $_POST['tech_name'];

    if($region!='') {
        $sql = "INSERT INTO land(region, landmark, block, location, area, status,)
            VALUES ('$region', '$landmark', '$block', '$location', $area, $status)";
        
        include("../inc/mysql.php");
        $conn = new mysqlconn();
        if($tech_id != '-1') {
            $query = "select username from user where user_id = $tech_id;";
            $rows = $conn->excu_json($query);
            $tech_name = $rows[0]['username'];
            $sql = "INSERT INTO land(region, landmark, block, location, area, status, tech_id, tech_name)
                VALUES ('$region', '$landmark', '$block', '$location', $area, $status, $tech_id, '$tech_name')";
        }
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
    $tech_id = $_POST['tech_id'];

    include("../inc/mysql.php");
    $conn = new mysqlconn();
    if($tech_id!=''&&$tech_id!='-1') {
        // echo "ok";
        $query = "select username from user where user_id = $tech_id;";
        $rows = $conn->excu_json($query);
        $tech_name = $rows[0]['username'];
        
        $sql = "UPDATE land SET region='$region', landmark='$landmark', block='$block', 
            location='$location', area=$area, status=$status, tech_id=$tech_id, tech_name='$tech_name' 
            WHERE land_id=$land_id";
    } else {
        $sql = "UPDATE land SET region='$region', landmark='$landmark', block='$block', 
        location='$location', area=$area, status=$status, tech_id=null, tech_name=''
        WHERE land_id=$land_id";
    }

    // echo $sql;
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
} elseif($action == "techs") {
    $query = "SELECT DISTINCT username, user_id FROM user WHERE identity= 2;";
    include("../inc/mysql.php");
    $conn = new mysqlconn();
    $rows = $conn->excu_json($query);
    echo json_encode($rows);
}

?>