$(function() {
    pageinit();
});

function pageinit() {
    $("#table").bootstrapTable(
        {
            url : '../src/bom.php?action=list',
            datatype : "json",
            height: 600,
            scroll: false,
            uniqueId: "id",
            columns: [{
                field: 'id',
                title: 'BOM_ID',
                visible: false
            }, {
                field: 'number',
                title: '编号'
            }, {
                field: 'produce_date',
                title: '日期'
            }, {
                field: 'labor_cost',
                title: '劳务费'
            }, {
                field: 'waste_rate',
                title: '损耗比'
            },{
                field: 'operate',
                title: '操作',
                width: 140,
                align: 'center',
                formatter: function(value, row, index) {
                    return [
                        "<button type='button' class='btn btn-warning' onclick='edit(" + row.land_id + ")'>编辑</button>"
                        + "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.land_id + ")'>删除</button>"
                    ];
                }
            } ]
        });
    console.log("ok");
}