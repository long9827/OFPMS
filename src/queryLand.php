<?php
$region = isset($_POST['region']) ? htmlspecialchars($_POST['region']) : '';
$landmark = isset($_POST['landmark']) ? htmlspecialchars($_POST['landmark']) : '';
$block = isset($_POST['block']) ? htmlspecialchars($_POST['block']) : '';
$location = isset($_POST['location']) ? htmlspecialchars($_POST['location']) : '';
$query = "select * from land where 1=1  ";
if($region!='') {
    $query .= "and region like '%$region%'  ";
}
if($landmark!='') {
    $query .= "and landmark like '%$landmark%' ";
}
if($block!='') {
    $query .= "and block like '%$block%' ";
}
if($location!='') {
    $query .= "and location like '%$location%' ";
}
$query .= "order by land_id";
// echo $query;
include("../inc/mysql.php");
$sql = new mysqlconn();
if($result = $sql->excu_json($query)) {
    echo json_encode($result);
}
?>