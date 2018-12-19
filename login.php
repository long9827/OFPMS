<?php
//登录
if(isset($_POST['submit'])) {
    //登录
    $username = htmlspecialchars($_POST['username']);
    $password = MD5($_POST['password']);
    //包含数据库连接文件
    include('inc/mysql.php');
    $sql = new mysqlconn();
    $query = "select user_id, identity from user where username = '$username' and password = '$password' limit 1";
    if($result = mysqli_fetch_array($sql->excu($query))) {
        //登录成功
        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['userid'] = $result['user_id'];
        $_SESSION['identity'] = $result['identity'];
        header("Location: index.html");
    } else {
        exit('登录失败！点击此处<a href="javascript:history.back(-1)"；>返回</a>');
    }
} elseif($_GET['action'] == "logout") {
    //注销登录
    session_start();
    unset($_SESSION['username']);
    unset($_SESSION['userid']);
    unset($_SESSION['identity']);
    header("Location: login.html");
} else {
    header("Location: 404.html");
    exit;
}
?>