<?php
if($_SERVER['PHP_SELF']."" == "/OFPMS/inc/head.php" ) {
    //访问路径不对
    header("Location: ../index.php");
}
@session_start();
?>
<table action="logout.php" width="100%">
    <tr>
        <td width="96%">欢迎，<?php echo $_SESSION['username']; ?></td>
        <td width="4%"><a href="login.php?action=logout">退出登录</a></td>
    </tr>
    <tr>
        <td height='2'></td>
    </tr>
</table>