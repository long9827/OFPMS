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
				uniqueId: "purchase_id",
				columns: [{
					field: 'purchase_id',
					title: 'purchase_id',
					visible: false
				}, {
					field: 'purchase_Date',
					title: '购置日期'
				}, {
					field: 'purchase_price',
					title: '购置单价'
				}, {
					field: 'product_name',
					title: '产品名称'
				}, {
					field: 'amount',
					title: '数量'
				},{
					field: 'note',
					title: '备注',
					width: 70,
					align: 'center',
					
				}, {
					field: 'tech_name',
					title: '农场主'
				}, {
					field: 'operate',
					title: '操作',
					width: 140,
					align: 'center',
					
					}
				} ]
			});
}

}
var vm = new Vue({
	el: '#app',
	data: {
		landInfo: {
			purchase_Date: '',
			purchase_price: '',
			product_name: '',
			amount: '',
			tech_name: '',
			note: 2
		},
		addlandInfo:{},
	},
	methods: {
		search: function() {
			$.ajax({
				type: "post",
				url: "../src/purchase.php?action=list",
				data: {
					purchase_Date: vm.landInfo.purchase_Date,
					purchase_price: vm.landInfo.purchase_price,
					product_name: vm.landInfo.product_name,
					amount: vm.landInfo.amount,
					tech_name: vm.landInfo.tech_name,
					note: vm.landInfo.note
				},
				dataType:"json",
				success : function(json) {
					$("#table").bootstrapTable('load', json);
				}
			});
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