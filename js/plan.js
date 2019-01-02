$(function() {
	pageinit();
	vm.initVegetables();
	vm.initLands();
});

function pageinit() {
	$("#table").bootstrapTable({
		url : '../src/plan.php?action=list',
		datatype : "json",
		height: 600,
		scroll: false,
		uniqueId: "id",
		columns: [{
			field: 'id',
			title: 'PlanID',
			visible: false
		}, {
			field: 'number',
			title: '编号'
		}, {
			field: 'vgt_name',
			title: '蔬菜名'
		}, {
			field: 'make_date',
			title: '制定日期'
		}, {
			field: 'sow_date',
			title: '播种日期'
		}, {
			field: 'land_id',
			title: 'land_id',
			visible: false
		}, {
			field: 'land_name',
			title: '地位'
		}, {
			field: 'list_date',
			title: '上市日期'
		},{
			field: 'list_harvest_wgt',
			title: '上市采收量'
		},{
			field: 'peak_date',
			title: '高峰日期'
		},{
			field: 'peak_harvest_wgt',
			title: '高峰采收量'
		},{
			field: 'delist_date',
			title: '下市日期'
		}, {
			field: 'tech_id',
			title: 'tech_id',
			visible: false
		}, {
			field: 'tech_name',
			title: '技术员'
		}, {
			field: 'status',
			title: '状态',
			align: 'center',
			formatter: function(value, row, index) {
				return value == 1 ?
					'<span class="label label-success">正常</span>' :
					'<span class="label label-danger">中止</span>';
			}
		}, {
			field: 'operate',
			title: '操作',
			// width: 140,
			// align: 'le',
			formatter: function(value, row, index) {
				var str = '';
				if(getCookie('user_id') == row.tech_id) {
					//该计划由已登录管理员创建，可以增删改
					var sowDate = new Date(Date.parse(row.sow_date));
					var now = new Date();
					now.setDate(now.getDate()-12);
					if(cmp_date(sowDate, now)>0) {
						//未超过播种日期12天
						str += "<button type='button' class='btn btn-warning' onclick='edit(" + row.id + ")'>修改</button>";
						str += "&nbsp;<button type='button' class='btn btn-danger' onclick='deleteRow(" + row.id + ")'>删除</button>";
					}
					if(row.status==1) {
						str += "&nbsp;<button type='button' class='btn btn-warning' onclick='stop(" + row.id + ")'>中止</button>";
					}

				}
				if(row.status!=1) {
					str += "&nbsp;<button type='button' class='btn btn-info' onclick='show(" + row.id + ")'>详情</button>";
				}
				return [str];
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

function show(id) {
	vm.showStop(id);
}
function stop(id) {
	vm.stop(id);
}



function cmp_date(t1, t2) {
	if(t1.getFullYear()!=t2.getFullYear()) {
		//年不相同，则比较年
		return t1.getFullYear() - t2.getFullYear();
	} else if(t1.getMonth() != t2.getMonth()) {
		//年相同，月不相同，则比较月
		return t1.getMonth() -t2.getMonth();
	} else {
		//年月相同，则比较日
		return t1.getDate() - t2.getDate();
	}
}

var vm = new Vue({
	el: '#app',
	data: {
		vegetables: {},
		lands: {},
		planInfo: {},
		stopInfo: {},
		searchInfo: {
			status: '2'
		}
	},
	methods: {
		initVegetables: function() {
			$.ajax({
				type: "post",
				url: "../src/plan.php?action=vegetables",
				data: {},
				dataType:"json",
				success : function(json) {
					vm.vegetables = eval(json);
				}
			});
		},
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
		search: function() {
			$.ajax({
				type: "post",
				url: "../src/plan.php?action=list",
				data: {
					number: vm.searchInfo.number,
					vgt_name: vm.searchInfo.vgt_name,
					sow_date: vm.searchInfo.sow_date,
					status: vm.searchInfo.status
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		},
		edit: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			vm.planInfo = {
				id: row.id,
				number: row.number,
				vgt_name: row.vgt_name,
				sow_date: row.sow_date,
				land_id: row.land_id,
				list_date: row.list_date,
				list_harvest_wgt: row.list_harvest_wgt,
				peak_date: row.peak_date,
				peak_harvest_wgt: row.peak_harvest_wgt,
				delist_date: row.delist_date
			};
			$("#modal_title").text("修改");
			$("#myModal").modal("show");
		},
		add: function() {
			vm.planInfo = {};
			$("#modal_title").text("新增");
            $("#myModal").modal("show");
		},
		delete: function(id) {
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			var msg = "确定要删除计划：\n编号：" + row.number + "\n名称：" + row.vgt_name; 
			if(confirm(msg)) {
				//确认删除记录
				$.ajax({
					type: "post",
					url: "../src/plan.php?action=delete",
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
		stop: function(id) {			
			var row = $("#table").bootstrapTable('getRowByUniqueId', id);
			vm.stopInfo = {
				id: row.id,
				number: row.number
			};
			$("#stopbtn").show();
			$("#stop_date").attr("readonly", false);
			$("#reason").attr("readonly", false);
            $("#stopModal").modal("show");
		},
		showStop: function(id) {
			$.ajax({
				type: "post",
				async: false,
				url: "../src/plan.php?action=showStop",
				data: {
					id: id
				},
				dataType: "json",
				success: function(json) {
					vm.stopInfo = {
						number: json[0]['number'],
						stop_date: json[0]['stop_date'],
						reason: json[0]['reason']
					};
				}
			});
			$("#stopbtn").hide();
			$("#stop_date").attr("readonly", true);
			$("#reason").attr("readonly", true);
            $("#stopModal").modal("show");			
		},
		modalCommit: function() {
			if($("#modal_title").text() =="新增") {
				if(!vm.planInfo.number) {
					alert("请输入编号！");
				} else if(!vm.planInfo.vgt_name) {
					alert("请选择蔬菜名！");
				} else if(!vm.planInfo.sow_date) {
					alert("请输入播种日期！");
				} else if(!vm.planInfo.land_id) {
					alert("请选择播种地位！");
				} else if(!vm.planInfo.list_date) {
					alert("请选择上市日期！");
				} else if(!vm.planInfo.list_harvest_wgt) {
					alert("请输入上市采收量！");
				}  else if(!vm.planInfo.peak_date) {
					alert("请输入高峰日期！");
				}  else if(!vm.planInfo.peak_harvest_wgt) {
					alert("请输入高峰采收量！");
				}  else if(!vm.planInfo.delist_date) {
					alert("请输入下市日期！");
				} else {
					// 新增购买记录
					$("#myModal").modal("hide");
					$.ajax({
						type: "post",
						url: "../src/plan.php?action=add",
						data: {
							number: vm.planInfo.number,
							vgt_name: vm.planInfo.vgt_name,
							sow_date: vm.planInfo.sow_date,
							land_id: vm.planInfo.land_id,
							list_date: vm.planInfo.list_date,
							list_harvest_wgt: vm.planInfo.list_harvest_wgt,
							peak_date: vm.planInfo.peak_date,
							peak_harvest_wgt: vm.planInfo.peak_harvest_wgt,
							delist_date: vm.planInfo.delist_date
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
					url: "../src/plan.php?action=edit",
					data: {
						id: vm.planInfo.id,
						number: vm.planInfo.number,
						vgt_name: vm.planInfo.vgt_name,
						sow_date: vm.planInfo.sow_date,
						land_id: vm.planInfo.land_id,
						list_date: vm.planInfo.list_date,
						list_harvest_wgt: vm.planInfo.list_harvest_wgt,
						peak_date: vm.planInfo.peak_date,
						peak_harvest_wgt: vm.planInfo.peak_harvest_wgt,
						delist_date: vm.planInfo.delist_date
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
		stopCommit: function() {
			if(!vm.stopInfo.stop_date) {
				alert("请输入中止日期！");
			} else if(!vm.stopInfo.reason) {
				alert("请输入中止原因！")
			} else {
				$("#stopModal").modal("hide");
				$.ajax({
					type: "post",
					url: "../src/plan.php?action=stop",
					data: {
						id: vm.stopInfo.id,
						number: vm.stopInfo.number,
						stop_date: vm.stopInfo.stop_date,
						reason: vm.stopInfo.reason
					},
					dataType: "json",
					success: function(json) {
						if(json['code'] == '0') {
							alert("已中止");
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
				url: "../src/plan.php?action=list",
				data: {},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
		}
	}
});

