<?php
if($_SERVER['PHP_SELF']."" == "/OFPMS/inc/menu.php" ) {
    //访问路径错误
    header("Location: ../index.php");
}
// @session_start();
?>
<div  class="col-md-2 sidebar" id="menu">
    <ul class="nav nav-sidebar">
        <li v-if="hasPermission('land')"><a href="/OFPMS/manage/land.html">土地管理</a></li>
        <li v-if="hasPermission('purchase')"><a href="/OFPMS/manage/purchase.html">生产材料购买</a></li>
        <li v-if="hasPermission('bom')"><a href="/OFPMS/manage/bom.html">配肥和配药管理</a></li>
        <li v-if="hasPermission('plan')"><a href="/OFPMS/manage/plan.html">生产计划管理</a></li>
        <li v-if="hasPermission('farm')"><a href="/OFPMS/manage/farm.html">农作记录管理</a></li>
        <li v-if="hasPermission('harvest')"><a href="/OFPMS/manage/harvest.html">实际采收管理</a></li>
        <!-- <li v-if="hasPermission('harvest')"><a href="/OFPMS/index.html">提醒管理</a></li> -->
        <li v-if="hasPermission('estimated-harvest')"><a href="/OFPMS/manage/estimated-harvest.html">预计可采收量</a></li>
        <li v-if="hasPermission('statistics')"><a href="/OFPMS/manage/statistics.html">统计蔬菜经营盈亏</a></li>
        <li v-if="hasPermission('plot')"><a href="/OFPMS/manage/plot.html">生产经营折线图</a></li>
    </ul>
</div>

<script src="/OFPMS/js/common.js"></script>