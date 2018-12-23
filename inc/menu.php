<?php
if($_SERVER['PHP_SELF']."" == "/OFPMS/inc/menu.php" ) {
    //访问路径错误
    header("Location: ../index.php");
}
// @session_start();
?>
<div  class="col-md-2 sidebar">
    <ul class="nav nav-sidebar">
        <li><a href="/OFPMS/manage/land.html">土地管理</a></li>
        <li><a href="/OFPMS/manage/purchase.html">生产材料购买</a></li>
        <li><a href="#">配肥和配药管理</a></li>
        <li><a href="#">生产计划管理</a></li>
        <li><a href="#">农作记录管理</a></li>
        <li><a href="#">实际采收管理</a></li>
        <li><a href="#">提醒管理</a></li>
        <li><a href="#">预计可采收量</a></li>
        <li><a href="#">统计蔬菜经营盈亏</a></li>
        <li><a href="#">生产经营折线图</a></li>
    </ul>
</div>
