$(function() {
	pageinit();
});

function pageinit() {
	$("#table").bootstrapTable({
		url : '../src/purchase.php?action=list',
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
			field: 'material_name',
			title: '名称'
		}, {
			field: 'buy_date',
			title: '购置日期'
		}, {
			field: 'amount',
			title: '数量'
		}, {
			field: 'unit_price',
			title: '单价'
		}, {
			// 类别 0-种子，1-原料
			field: 'class',
			title: '单位',
			formatter: function(value, row, index) {
				return value == 0 ?
					'元/g' :
					'元/kg';
			}
		}, {
			field: 'note',
			title: '备注',
			width: 70,
			align: 'center',
		}, {
			field: 'operate',
			title: '操作',
			width: 140,
			align: 'center',
			formatter: function(value, row, index) {
				return [
					"<button type='button' class='btn btn-warning' onclick='edit(" + row.id + ")'>修改</button>"
					+ "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.id + ")'>删除</button>"
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
		recordInfo: {},
		searchInfo: {
			class: 2
		}
	},
	methods: {
		search: function() {
			$.ajax({
				type: "post",
				url: "../src/purchase.php?action=list",
				data: {
					number: vm.searchInfo.number,
					buy_date: vm.searchInfo.buy_date,
					material_name: vm.searchInfo.material_name,
					class: vm.searchInfo.class
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		},
		add: function() {
            vm.recordInfo = {},
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
		},
		delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要购置记录：\n编号：" + row.number + "\n名称：" + row.material_name; 
			if(confirm(msg)) {
				//确认删除记录
				$.ajax({
					type: "post",
					url: "../src/purchase.php?action=delete",
					data: {
						id: id,
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("删除成功");
							vm.reload();
						} else {
							alert(json['msg']);
						}
					}
				});
			}
		},
		edit: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
            vm.recordInfo = {
				id: id,
				number: row.number,
				buy_date: row.buy_date,
				material_name: row.material_name,
				amount: row.amount,
				unit_price: row.unit_price,
				class: row.class,
				note: row.note
			},
			$("#modal_title").text("修改");
            $("#myModal").modal("show");
		},
		modalCommit: function() {
			if($("#modal_title").text() =="新增") {
				console.log(vm.recordInfo.number);
				if(!vm.recordInfo.number) {
					alert("请输入编号！");
				} else if(!vm.recordInfo.buy_date) {
					alert("请输入购置日期！");
				} else if(!vm.recordInfo.material_name) {
					alert("请输入名称！");
				} else if(!vm.recordInfo.amount) {
					alert("请输入数量！");
				} else if(!vm.recordInfo.unit_price) {
					alert("请输入单价！");
				} else if(!vm.recordInfo.class) {
					alert("请选择类别！");
				} else {
					// 新增购买记录
					$("#myModal").modal("hide");
					$.ajax({
						type: "post",
						url: "../src/purchase.php?action=add",
						data: {
							number: vm.recordInfo.number,
							buy_date: vm.recordInfo.buy_date,
							material_name: vm.recordInfo.material_name,
							amount: vm.recordInfo.amount,
							unit_price: vm.recordInfo.unit_price,
							class: vm.recordInfo.class,
							note: vm.recordInfo.note
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
					url: "../src/purchase.php?action=edit",
					data: {
                        id: vm.recordInfo.id,
						number: vm.recordInfo.number,
						buy_date: vm.recordInfo.buy_date,
                        material_name: vm.recordInfo.material_name,
                        amount: vm.recordInfo.amount,
                        unit_price: vm.recordInfo.unit_price,
						class: vm.recordInfo.class,
						note: vm.recordInfo.note
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
				url: "../src/purchase.php?action=list",
				data: {},
				dataType:"json",
				success : function(json) {
						   $("#table").bootstrapTable('load', json);
				}
			});
		}
		
	}
});