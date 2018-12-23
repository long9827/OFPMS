$(function() {
	pageinit();
});

function pageinit() {
	$("#table").bootstrapTable(
			{
				url : '../src/land.php?action=list',
				datatype : "json",
				height: 600,
				scroll: false,
				uniqueId: "land_id",
				columns: [{
					field: 'land_id',
					title: 'LandID',
					visible: false
				}, {
					field: 'region',
					title: '地区'
				}, {
					field: 'landmark',
					title: '地标'
				}, {
					field: 'block',
					title: '地块'
				}, {
					field: 'location',
					title: '地位'
				},{
					field: 'area',
					title: '面积'
				},{
					field: 'status',
					title: '状态',
					width: 70,
					align: 'center',
					formatter: function(value, row, index) {
						return value == 0 ?
							'<span class="label label-info">闲置</span>' :
							'<span class="label label-success">正常</span>';
					}
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
							"<button type='button' class='btn btn-warning' onclick='edit(" + row.land_id + ")'>编辑</button>"
							+ "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.land_id + ")'>删除</button>"
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
			region: '',
			landmark: '',
			block: '',
			location: '',
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
					region: vm.landInfo.region,
					landmark: vm.landInfo.landmark,
					block: vm.landInfo.block,
					location: vm.landInfo.location,
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
				region: '',
				landmark: '',
				block: '',
				location: '',
				area: '',
				status: 0,
				tech: ''
			};
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
		},
		delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要删除土地：\n地区：" + row.region + "\n地标：" + row.landmark + "\n地块：" + row.block + "\n地位：" + row.location; 
			if(confirm(msg)) {
				//确认删除土地
				$.ajax({
					type: "post",
					url: "../src/land.php?action=delete",
					data: {
						land_id: id,
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
				land_id: id,
				region: row.region,
				landmark: row.landmark,
				block: row.block,
				location: row.location,
				area: row.area,
				status: row.status,
				tech: row.tech_name
			};
			$("#modal_title").text("修改");
            $("#myModal").modal("show");
		},
		modalCommit: function() {
			$("#myModal").modal("hide");
			
			if($("#modal_title").text() =="新增") {
				//新增土地
				$.ajax({
					type: "post",
					url: "../src/land.php?action=add",
					data: {
						region: vm.addlandInfo.region,
						landmark: vm.addlandInfo.landmark,
						block: vm.addlandInfo.block,
						location: vm.addlandInfo.location,
						area: vm.addlandInfo.area,
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
				//修改土地
				// console.log("xiugai");
				$.ajax({
					type: "post",
					url: "../src/land.php?action=edit",
					data: {
						land_id: vm.addlandInfo.land_id,
						region: vm.addlandInfo.region,
						landmark: vm.addlandInfo.landmark,
						block: vm.addlandInfo.block,
						location: vm.addlandInfo.location,
						area: vm.addlandInfo.area,
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