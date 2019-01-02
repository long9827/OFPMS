var permissions = new Array();

$.ajax({
    type: "post",
    async: false,
    url: "/OFPMS/src/common.php?action=permission",
    data: {},
    dataType:"json",
    success : function(json) {
        // console.log(json[0]['auth_name']);
        // var arr = JSON.parse(json);
        // var arr = [{auth_name: 'plan:add'}];
        // console.log(json.length);
        for(i in json) {
            // console.log(json[i]['auth_name']);
            permissions.push(json[i]['auth_name']);
        }
    }
});

//权限判断
function hasPermission(permission) {
    // console.log(permission);
    // console.log(permissions);
    if (permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0)
			return c.substring(name.length,c.length);
	}
	return "";
}



var menu = new Vue({
	el: '#menu',
	data: {
        addInfo: {},
        auths: {}
	},
    methods: {}
});