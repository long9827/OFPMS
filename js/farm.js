$(function() {
	pageinit();
	vm.initLands();
});

function pageinit() {
	$("#table").bootstrapTable(
			{
				url : '../src/farm.php?action=list',
				datatype : "json",
				height: 600,
				scroll: false,
				uniqueId: "id",
				columns: [{
					field: 'id',
					title: 'id',
					visible: false
				}, {
					field: 'number',
					title: '编号'
				}, {
					field: 'farm_date',
					title: '日期'
				}, {
					field: 'land_id',
					title: 'landID',
					visible: false
				}, {
					field: 'land_name',
					title: '地位'
				}, {
					field: 'labor_cost',
					title: '劳务费'
				}, {
					field: 'farm_name',
					title: '农作名称'
				}, {
					field: 'bom_name',
					title: '用料'
				}, {
					field: 'amount',
					title: '使用量'
				}, {
					field: 'class',
					title: '单位',
					formatter: function(value, row, index) {
						return value=='0'?'g':'kg';
					}
				}, {
					field: 'operate',
					title: '操作',
					width: 140,
					align: 'center',
					visible: hasPermission('farm:operate'),
					formatter: function(value, row, index) {
						if(getCookie('user_id') == row.tech_id) {
							//该计划由已登录管理员创建，可以增删改
							return [
								"<button type='button' class='btn btn-warning' onclick='edit(" + row.id + ")'>编辑</button>"
								+ "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.id + ")'>删除</button>"
							];
						}
						return '';
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
		addfarmInfo: {},
		lands: {},
		bom_name: {},
		searchInfo: {}
	},
	methods: {
		initLands: function() {
			$.ajax({
				type: "post",
				url: "../src/plan.php?action=lands",
				data: {},
				dataType:"json",
				success : function(json) {
					vm.lands = eval(json);
				}
			});
		},
		initBomName: function(classID) {
			$.ajax({
				type: "post",
				url: "../src/farm.php?action=bom_name",
				data: {
					class: classID
				},
				dataType:"json",
				success : function(json) {
					vm.bom_name = eval(json);
				}
			});
		},
		classChange: function() {
			console.log(vm.addfarmInfo.class);
			vm.initBomName(vm.addfarmInfo.class);
		},
		search: function() {
			
			$.ajax({
				type: "post",
				url: "../src/farm.php?action=list",
				data: {
					number: vm.searchInfo.number,
					farm_date: vm.searchInfo.farm_date,
					farm_name: vm.searchInfo.farm_name
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		},

		add: function() {
			vm.addfarmInfo = {},
			vm.bom_name = {},
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
		},
		delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要删除该记录：\n编号：" + row.number + "\n名称：" + row.farm_name; 
			if(confirm(msg)) {
				//确认删除记录
				$.ajax({
					type: "post",
					url: "../src/farm.php?action=delete",
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
			vm.initBomName(row.class);
            vm.addfarmInfo = {
				id: id,
				number: row.number,
				farm_date: row.farm_date,
				land_id: row.land_id,
				farm_name: row.farm_name,
				class: row.class,
				bom_name: row.bom_name,
				amount: row.amount,
				labor_cost: row.labor_cost
            };
			$("#modal_title").text("修改");
            $("#myModal").modal("show");
		},
		modalCommit: function() {
			if($("#modal_title").text() =="新增") {
				if(!vm.addfarmInfo.number) {
					alert("请输入编号！");
				} else if(!vm.addfarmInfo.farm_date) {
					alert("请输入劳作日期！");
				} else if(!vm.addfarmInfo.land_id) {
					alert("请选择地位！");
				} else if(!vm.addfarmInfo.farm_name) {
					alert("请输入劳作名称！");
				} else if(!vm.addfarmInfo.class) {
					alert("请选择用料类别！");
				}  else if(!vm.addfarmInfo.bom_name) {
					alert("请选择用料名！");
				}  else if(!vm.addfarmInfo.amount) {
					alert("请输入使用量！");
				}  else if(!vm.addfarmInfo.labor_cost) {
					alert("请输入劳务费！");
				} else {
					// 新增购买记录
					$("#myModal").modal("hide");
					$.ajax({
						type: "post",
						url: "../src/farm.php?action=add",
						data: {
							number: vm.addfarmInfo.number,
							farm_date: vm.addfarmInfo.farm_date,
							land_id: vm.addfarmInfo.land_id,
							labor_cost: vm.addfarmInfo.labor_cost,
							farm_name: vm.addfarmInfo.farm_name,
							bom_name: vm.addfarmInfo.bom_name,
							amount: vm.addfarmInfo.amount,
							class: vm.addfarmInfo.class
						},
						dataType: "json",
						success: function(json) {
							if(json['code'] == '0') {
								alert("新增成功");
								vm.reload();
							} else {
								alert(json['msg']);
							}
						}
					});
				}
			} else if($("#modal_title").text() =="修改") {
				$("#myModal").modal("hide");
                //修改购买记录
				$.ajax({
					type: "post",
					url: "../src/farm.php?action=edit",
					data: {
						id: vm.addfarmInfo.id,
						number: vm.addfarmInfo.number,
						farm_date: vm.addfarmInfo.farm_date,
						land_id: vm.addfarmInfo.land_id,
						labor_cost: vm.addfarmInfo.labor_cost,
						farm_name: vm.addfarmInfo.farm_name,
						bom_name: vm.addfarmInfo.bom_name,
						amount: vm.addfarmInfo.amount,
						class: vm.addfarmInfo.class
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("修改成功");
							vm.reload();
						} else {
							alert(json['msg']);
						}
					}
				});
			}
		},
		reload: function() {
			$.ajax({
				type: "post",
				url: "../src/farm.php?action=list",
				data: {},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		}
		
	}
});