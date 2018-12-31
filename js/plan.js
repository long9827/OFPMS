$(function() {
	pageinit();
});

function pageinit() {
	$("#table").bootstrapTable(
			{
				url : '../src/plan.php?action=list',
				datatype : "json",
				height: 600,
				scroll: false,
				uniqueId: "plan_id",
				columns: [{
					field: 'plan_id',
					title: 'PlanID',
					visible: false
				}, {
					field: 'name',
					title: '名称'
				}, {
					field: 'plan_date',
					title: '制定日期'
				}, {
					field: 'forecast_sow_date',
					title: '播种日期'
				}, {
					field: 'forecast_sow_land',
					title: '地位'
				},{
					field: 'forecast_market_date',
					title: '上市日期'
				},{
					field: 'forecast_market_date_purchase quantity',
					title: '上市采购量'
				},{
					field: 'forecast_high_date',
					title: '高峰日期'
				},{
					field: 'forecast_high_date_purchase quantity',
					title: '高峰采购量'
				},{
					field: 'forecast_sold out_date',
					title: '下市日期'
				}, {
					field: 'tech_name',
					title: '技术员'
				}, {
					field: 'operate',
					title: '操作',
					width: 140,
					align: 'center',
					formatter: function(value, row, index) {
						return [
							"<button type='button' class='btn btn-warning' onclick='edit(" + plan.plan_id + ")'>编辑</button>"
							+ "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.plan_id + ")'>删除</button>"
						];
					}
				} ]
			});
}

function edit(id) {
	vm.edit(id);
}

function deleteRow(id) {
	vm.delete(id);
}

var vm = new Vue({
	el: '#app',
	data: {
		landInfo: {
			name: '',
			plan_date: '',
			forecast_sow_date: '',
			forecast_sow_land: '',
			tech_name: '',
			status: 2
		},
		addlandInfo:{},
	},
	methods: {
		search: function() {
			$.ajax({
				type: "post",
				url: "../src/land.php?action=list",
				data: {
					name: vm.landInfo.name,
					plan_date: vm.landInfo.plan_date,
					forecast_sow_date: vm.landInfo.forecast_sow_date,
					forecast_sow_land: vm.landInfo.forecast_sow_land,
					tech_name: vm.landInfo.tech_name,
					status: vm.landInfo.status
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		},

		add: function() {
			vm.addlandInfo = {
				name: '',
				plan_date: '',
				forecast_sow_date: '',
				forecast_sow_land: '',
				forecast_market_date: '',
				status: 0,
				tech: ''
			};
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
		},
		delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要删除：\n：" + row.name + "\n地标：" + row.plan_date + "\n地块：" + row.forecast_sow_date + "\n地位：" + row.forecast_sow_land; 
			if(confirm(msg)) {
				//确认删除
				$.ajax({
					type: "post",
					url: "../src/land.php?action=delete",
					data: {
						plan_id: id,
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("删除成功");
						} else {
							console.log(json['msg']);
							alert("删除\n"+json['msg']);
						}
						vm.reload();
					}
				});
			}
		},
		edit: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			vm.addlandInfo = {
				plan_id: id,
				name: row.name,
				plan_date: row.plan_date,
				forecast_sow_date: row.forecast_sow_date,
				forecast_sow_land: row.forecast_sow_land,
				forecast_market_date: row.forecast_market_date,
				status: row.status,
				tech: row.tech_name
			};
			$("#modal_title").text("修改");
            $("#myModal").modal("show");
		},
		modalCommit: function() {
			$("#myModal").modal("hide");
			
			if($("#modal_title").text() =="新增") {
				//新增
				$.ajax({
					type: "post",
					url: "../src/land.php?action=add",
					data: {
						name: vm.addlandInfo.name,
						plan_date: vm.addlandInfo.plan_date,
						forecast_sow_date: vm.addlandInfo.forecast_sow_date,
						forecast_sow_land: vm.addlandInfo.forecast_sow_land,
						forecast_market_date: vm.addlandInfo.forecast_market_date,
						status: vm.addlandInfo.status,
						tech: vm.addlandInfo.tech
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("添加成功");
						} else {
							alert("添加失败！\n"+json['msg']);
						}
						vm.reload();
					}
				});
			} else if($("#modal_title").text() =="修改") {
				//修改
				// console.log("xiugai");
				$.ajax({
					type: "post",
					url: "../src/land.php?action=edit",
					data: {
						plan_id: vm.addlandInfo.plan_id,
						name: vm.addlandInfo.name,
						plan_date: vm.addlandInfo.plan_date,
						forecast_sow_date: vm.addlandInfo.forecast_sow_date,
						forecast_sow_land: vm.addlandInfo.forecast_sow_land,
						forecast_market_date: vm.addlandInfo.forecast_market_date,
						status: vm.addlandInfo.status,
						tech: vm.addlandInfo.tech
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
				url: "../src/land.php?action=list",
				data: {},
				dataType:"json",
				success : function(json) {
						   $("#table").bootstrapTable('load', json);
				}
			});
		}
		
	}
});