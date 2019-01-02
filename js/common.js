var permissions = new Array();

$.ajax({
    type: "post",
    async: false,
    url: "../src/common.php?action=permission",
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
    if (permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}