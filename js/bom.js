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
            detailView: true,
            columns: [{
                field: 'id',
                title: 'BOM_ID',
                visible: false
            }, {
                field: 'number',
                title: '编号'
            }, {
                field: 'bom_name',
                title: '名称'
            }, {
                field: 'class',
                title: '类别',
                formatter: function(value, row, index) {
                    return value=='3'?'农药':'肥料';
                }
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
                width: 220,
                align: 'center',
                visible: hasPermission('bom:operate'),
                formatter: function(value, row, index) {
                    return [
                        "<button type='button' class='btn btn-info' onclick='add_material(" + row.id + ")'>添加原料</button>"
                        + "&nbsp;<button type='button' class='btn btn-warning' onclick='edit(" + row.id + ")'>修改</button>"
                        + "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.id + ")'>删除</button>"
                    ];
                }
            } ],
            onExpandRow: function(index, row, $detail) {    //创建子表
                var bom_id = row.id;
                var sub = $detail.html("<table id='child_table" + bom_id  + "'></table>").find('table');
                $(sub).bootstrapTable({
                    url : '../src/bom.php?action=list_detail',
                    datatype: "json",
                    method: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    queryParams: { bom_id: bom_id },
                    uniqueId: "id",
                    columns: [ {
                        field: 'id',
                        text: 'bom_detailID',
                        visible: false
                    }, {
                        field: 'bom_id',
                        text: 'bom_id',
                        visible: false
                    }, {
                        field: 'material_name',
                        title: '原料名称'
                    }, {
                        field: 'material_wgt',
                        title: '使用量'
                    }, {
                        field: 'unit',
                        title: '单位'
                    }, {
                        field: 'operate',
                        title: '操作',
                        align: 'center',
                        width: 150,
                        visible: hasPermission('bom:operate'),
                        formatter: function(value, row, index) {
                            return [
                                "<button type='button' class='btn btn-warning' onclick='editDetail(" + row.id + ")'>修改</button>"
                                + "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteDetail(" + row.id + ")'>删除</button>"
                            ];
                        }
                    }],
                    onClickRow: function(row, $element) {
                        vm.bom_detailInfo = {
                            bom_id: row.bom_id,
                            id: row.id,
                            material_name: row.material_name,
                            material_wgt: row.material_wgt,
                        };
                    }
                })
            }
        });
}

//肥料或农药添加原料
function add_material(id) {
    vm.add_material(id);
}

//编辑肥料或农药信息
function edit(id) {
    vm.edit(id);
}

//删除肥料或农药信息
function deleteRow(id) {
    vm.delete(id);
}

//编辑原料
function editDetail(id) {
    vm.editDetail(id);
}

//删除原料
function deleteDetail(id) {
    //延迟10ms执行，等待vm.bom_detailInfo更新
    setTimeout("vm.deleteDetail(" + id + ")", 10);
}

var vm = new Vue({
	el: '#app',
	data: {
        addbomInfo: {},
        bom_detailInfo: {},
        bomInfo: {}
	},
	methods: {
        search: function() {
			$.ajax({
				type: "post",
				url: "../src/bom.php?action=list",
				data: {
                    number: vm.bomInfo.number,
                    bom_name: vm.bomInfo.name,
                    produce_date: vm.bomInfo.date
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		},
        add: function() {
            vm.addbomInfo = {},
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
        },
        delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要删除该记录：\n编号：" + row.number + "\n农作名称：" + row.bom_name; 
			if(confirm(msg)) {
				//确认删除记录
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=delete",
					data: {
						id: id,
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("删除成功");
						} else {
							console.log(json['msg']);
							alert(json['msg']);
						}
						vm.reload();
					}
				});
			}
		},
        edit: function(id) {
            var row = $("#table").bootstrapTable('getRowByUniqueId', id);
            vm.addbomInfo = {
                id: id,
                number: row.number,
                name: row.bom_name,
                class: row.class,
                date: row.produce_date,
                cost: row.labor_cost,
                waste_rate: row.waste_rate
            };
			$("#modal_title").text("修改");
            $("#myModal").modal("show");
        },
        modalCommit: function() {
			$("#myModal").modal("hide");
			
			if($("#modal_title").text() =="新增") {
				//新增肥料或农药配料记录
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=add",
					data: {
                        number: vm.addbomInfo.number,
                        produce_date: vm.addbomInfo.date,
                        bom_name: vm.addbomInfo.name,
                        class: vm.addbomInfo.class,
                        labor_cost: vm.addbomInfo.cost,
                        waste_rate: vm.addbomInfo.waste_rate
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("新增成功");
						} else {
							alert(
                                json['msg']);
						}
						vm.reload();
					}
				});
			} else if($("#modal_title").text() =="修改") {
                //修改肥料或农药配料记录
                console.log("xiugai");
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=edit",
					data: {
                        id: vm.addbomInfo.id,
                        number: vm.addbomInfo.number,
                        bom_name: vm.addbomInfo.name,
                        class: vm.addbomInfo.class,
                        produce_date: vm.addbomInfo.date,
                        labor_cost: vm.addbomInfo.cost,
                        waste_rate: vm.addbomInfo.waste_rate
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("修改成功");
						} else {
							alert(json['msg']);
						}
						vm.reload();
					}
				});
			}
        },
        reload: function() {
			$.ajax({
				type: "post",
				url: "../src/bom.php?action=list",
				data: {},
				dataType:"json",
				success : function(json) {
						   $("#table").bootstrapTable('load', json);
				}
			});
        },
        add_material: function(id) {
            vm.bom_detailInfo = {
                bom_id: id
            },
			$("#detailTitle").text("新增原料");
            $("#detailModal").modal("show");
        },
        deleteDetail: function(id) {
			var msg = "确定要删除原料：" + vm.bom_detailInfo.material_name;
			if(confirm(msg)) {
				//确认删除记录
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=deleteDetail",
					data: {
						id: id,
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("删除成功");
						} else {
							console.log(json['msg']);
							alert(json['msg']);
						}
						vm.subReload(vm.bom_detailInfo.bom_id);
					}
				});
			}
        },
        editDetail: function(id) {
            vm.bom_detailInfo.id = id;
			$("#detailTitle").text("修改原料");
            $("#detailModal").modal("show");
        },
        detailCommit: function() {
            $("#detailModal").modal("hide");
            if($("#detailTitle").text() =="新增原料") {
                //新增原料
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=addDetail",
					data: {
                        bom_id: vm.bom_detailInfo.bom_id,
                        material_name: vm.bom_detailInfo.material_name,
                        material_wgt: vm.bom_detailInfo.material_wgt
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("新增成功");
						} else {
							alert(
                                json['msg']);
						}
						vm.subReload(vm.bom_detailInfo.bom_id);
					}
				});
			} else if($("#detailTitle").text() =="修改原料") {
                //修改原料
				$.ajax({
					type: "post",
					url: "../src/bom.php?action=editDetail",
					data: {
                        id: vm.bom_detailInfo.id,
                        material_name: vm.bom_detailInfo.material_name,
                        material_wgt: vm.bom_detailInfo.material_wgt
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("修改成功");
						} else {
							alert(json['msg']);
						}
						vm.subReload(vm.bom_detailInfo.bom_id);
					}
				});
			}
        },
        subReload: function(bom_id) {
			$.ajax({
				type: "post",
				url: "../src/bom.php?action=list_detail",
				data: {
                    bom_id: bom_id
                },
				dataType:"json",
				success : function(json) {
						   $("#child_table"+bom_id).bootstrapTable('load', json);
				}
			});
        }
    }
});
