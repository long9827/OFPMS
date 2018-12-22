<?php
if($_SERVER['PHP_SELF']."" == "/OFPMS/inc/head.php" ) {
    //访问路径不对
    header("Location: ../index.php");
}
@session_start();
//检测是否登录，若没有登录则转向登录界面
if(!isset($_SESSION['userid'])) {
    header("Location: login.html");
    exit();
}
?>
<div class="container-fluid">
    <div class="col-lg-2">&nbsp;</div>
    <h1 class="col-lg-8 text-center"><a href="/OFPMS/index.html">有机农场管理系统</a></h1>
    <div class="col-lg-2">
        <p>欢迎，<?php echo $_SESSION['username']; ?>&nbsp;&nbsp;<a href="/OFPMS/login.php?action=logout">退出登录</a></p>
    </div>
</div>