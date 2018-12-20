$(function() {
    // $("#land_table").attr("align", "center");
   
    $("#showLand").click(function() {
        loadland();
    });
    $("#remove").click(function() {
        clear();
    });
    loadland();
});

//加载数据
function loadland() {
    var dataParam = {
        region: $("#region").val(),
        landmark: $("#landmark").val(),
        block: $("#block").val(),
        location: $("#location").val()
    };
    $.post("../php/queryLand.php",  dataParam, function(data, status) {
        if(status=='success') {
            data = JSON.parse(data);
            if(data['code'] == 0) {
                alert("服务器异常！");
            } else {
                newTable(data);
            }
        }
    })
}

//构造table
function newTable(data) {
    clear();
    var len = data['count'];
    for(var i=0; i<len; ++i) {
        var str = "<tr>"
        +"<td>" + data['result'][i]['land_id'] + "</td>"
        +"<td>" + data['result'][i]['region'] + "</td>"
        +"<td>" + data['result'][i]['landmark'] + "</td>"
        +"<td>" + data['result'][i]['block'] + "</td>"
        +"<td>" + data['result'][i]['location'] + "</td>"
        +"</tr>";
        $("#land_table").append(str);
    }
    $("#land_table").length = len + 1;
}

//清空table
function clear() {
    $("#land_table tr").remove();
}