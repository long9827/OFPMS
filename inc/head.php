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
<div class="container-fluid page-header text-center">
    <h1 class="col-md-6 col-md-offset-3 title"><a href="/OFPMS/index.html">有机农场管理系统</a>
    
    </h1>
    <div id="logout" class="col-md-2 col-md-offset-1">
        <span>欢迎，<?php echo $_SESSION['username']; ?>&nbsp;&nbsp;<a href="/OFPMS/login.php?action=logout">退出登录</a></span>
    </div>        
</div>