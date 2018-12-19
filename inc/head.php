<?php
if($_SERVER['PHP_SELF']."" == "/OFPMS/inc/head.php" ) {
    //访问路径不对
    header("Location: ../index.php");
}
@session_start();
?>
<div class="head">
    <div class="left">&nbsp;</div>
    <h1 class="mainTitle">有机农场管理系统</h1>
    <div class="right">
        <p>欢迎，<?php echo $_SESSION['username']; ?>&nbsp;&nbsp;<a href="login.php?action=logout">退出登录</a></p>
    </div>
</div>