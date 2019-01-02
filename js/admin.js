$(function() {
	pageinit();
});

function pageinit() {
    $("#table").bootstrapTable({
        url : 'src/admin.php?action=list',
		datatype : "json",
		// height: 600,
		scroll: false,
		uniqueId: "id",
		columns: [{
			field: 'id',
			title: 'id'
		}, {
            field: 'identity',
            title: 'identity'
        }, {
            field: 'identity',
            title: '身份',
            formatter: function(value, row, index) {
                if(value==1) {
                    return '农场主';
                } else if(value == 2) {
                    return "技术人员";
                } else if(value ==3) {
                    return "市场人员";
                } else {
                    return "访客";
                }
			}
        }, {
            field: 'auth_id',
            title: 'auth_id'
        }, {
            field: 'auth_name',
            title: 'auth_name'
        }, {
            field: 'operate',
            title: '操作',
            formatter: function(value, row, index) {
                return "<button type='button' class='btn btn-warning' onclick='deleteRow(" + row.id + ")'>删除</button>";
			}
        }]
    })
}

function deleteRow(id) {
    if(confirm("确定删除？")) {
        $.ajax({
            type: "post",
            url: "src/admin.php?action=delete",
            data: {
                id: id
            },
            dataType: "json",
            success: function(json) {
                if(json['code'] == '0') {
                    alert("删除成功");
                    reload();
                } else {
                    alert(json['msg']);
                }
            }
        });
    }
}

function reload() {
    $.ajax({
        type: "post",
        url : 'src/admin.php?action=list',
        data: {},
        dataType:"json",
        success : function(json) {
            $("#table").bootstrapTable('load', json);
        }
    });
}

function addAuth() {
    var auth =prompt("权限：");
    if(auth) {
        $.ajax({
            type: "post",
            url: "src/admin.php?action=addAuth",
            data: {
                auth: auth
            },
            dataType: "json",
            success: function(json) {
                if(json['code'] == '0') {
                    alert("新增成功");
                    vm.initAuths();
                } else {
                    alert(json['msg']);
                }
            }
        });

    }
}


var vm = new Vue({
	el: '#app',
	data: {
        addInfo: {},
        auths: {}
	},
	methods: {
		initAuths: function() {
			$.ajax({
				type: "post",
				url: "src/admin.php?action=auths",
				data: {},
				dataType:"json",
				success : function(json) {
					vm.auths = eval(json);
				}
			});
        },
        add: function() {
            vm.addInfo = {};
            $("#myModal").modal("show");
        },
        authName: function(id) {
            for(i in vm.auths) {
                if(vm.auths[i].id == id) {
                    
                    return vm.auths[i].name;
                }
            }
            return '';
        },
		modalCommit: function() {
            if(!vm.addInfo.identity) {
                alert("请选择身份！");
            } else if(!vm.addInfo.auth) {
                alert("请选择权限！");
            } else {
                $("#myModal").modal("hide");
                $.ajax({
                    type: "post",
                    url: "src/admin.php?action=add",
                    data: {
                        identity: vm.addInfo.identity,
                        auth_id: vm.addInfo.auth,
                        auth_name: vm.authName(vm.addInfo.auth)
                    },
                    dataType: "json",
                    success: function(json) {
                        if(json['code'] == '0') {
                            alert("新增成功");
                            reload();
                        } else {
                            alert(json['msg']);
                        }
                    }
                });
            }
		}
	}
});

vm.initAuths();