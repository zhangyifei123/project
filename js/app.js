//主要用于配置路由，以及数据的处理
var app = angular.module('nbaApp',['ngRoute']);

//配置路由表
app.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl:'template/list.html',
		controller:function($scope){
			$scope.orderKey = "1";
		}
	})
	.when('/addPlayer',{
		templateUrl:"template/addPlayer.html",
		controller:function($scope,$location){

			//初始化位置数组
			$scope.pArr = ['SG','PG','SF','PF','C'];

			//初始化球队数组
			$scope.teamArr = ['黄蜂','步行者','爵士','公牛','马刺','火箭','快船','湖人','骑士','勇士'];

			$scope.saveInfo = function(){
				console.log($scope.pArr[$scope.position]);
				var player = {
					id:$scope.playerList.length+1,
					name:$scope.name,
					num:$scope.num,
					position:$scope.pArr[$scope.position],
					team:$scope.teamArr[$scope.team],
					thumb:'default.png',
					votes:0
				}
				$scope.playerList.push(player);
				$location.path('/home');
			}
			$scope.cancel = function(){
				$location.path('/home');
			}
			$scope.checkName = function(){
				console.log("-=-=-=-=")
				//判断name是否有值
				if (!$scope.name) {
					//如果没有值，则让参数showname为false
					$scope.showName = true;
				}else{
					$scope.showName = false;
				}
			}
			$scope.checkNum = function(){
				if (!$scope.num) {
					//
					$scope.showNum = true;
				}else{
					$scope.showNum = false;
				}
			}
			$scope.checkP = function(){
				if (!$scope.position) {
					//
					$scope.showP = true;
				}else{
					$scope.showP = false;
				}
			}
			$scope.checkTeam = function(){
				if (!$scope.team) {
					//
					$scope.showTeam = true;
				}else{
					$scope.showTeam = false;
				}
			}
		}
	})
	.when('/detail/:index',{
		templateUrl:"template/detail.html",
		controller:function($scope,$routeParams,$location){
			// console.log("-----"+$routeParams.index);
			$scope.player =  $scope.playerList[$routeParams.index];
			// console.log("++++"+$scope.player.name);

			// $scope.voteFun = function(btn){
			// 	$scope.player.votes++;
			// 	console.log(btn+"---")
			// }
			$scope.back = function(){
				$location.path('/home');
			}
		}
	})
	.when('/edit/:index1',{
		templateUrl:"template/edit.html",
		controller:function($scope,$routeParams,$location){
			$scope.player =  $scope.playerList[$routeParams.index1];
			$scope.name = $scope.player.name;
			$scope.num = $scope.player.num;
			$scope.thumb = $scope.player.thumb;
			//初始化位置数组
			$scope.pArr = ['SG','PG','SF','PF','C'];

			//初始化球队数组
			$scope.teamArr = ['黄蜂','步行者','爵士','公牛','马刺','火箭','快船','湖人','骑士','勇士'];
			$scope.position = $scope.pArr.indexOf($scope.player.position)+'';
			$scope.team = $scope.teamArr.indexOf($scope.player.team)+'';
			
			$scope.saveInfo = function(){
				$scope.player.name = $scope.name;
				$scope.player.num = $scope.num;
				$scope.player.position = $scope.pArr[$scope.position];
				$scope.player.team = $scope.teamArr[$scope.team];
				console.log($scope.player.num);
				$location.path('/home');
			}
			$scope.cancel = function(){
				$location.path('/home');
			}
			$scope.checkName = function(){
				console.log("-=-=-=-=")
				//判断name是否有值
				if (!$scope.name) {
					//如果没有值，则让参数showname为false
					$scope.showName = true;
				}else{
					$scope.showName = false;
				}
			}
			$scope.checkNum = function(){
				if (!$scope.num) {
					//
					$scope.showNum = true;
				}else{
					$scope.showNum = false;
				}
			}
			$scope.checkP = function(){
				if (!$scope.position) {
					//
					$scope.showP = true;
				}else{
					$scope.showP = false;
				}
			}
			$scope.checkTeam = function(){
				if (!$scope.team) {
					//
					$scope.showTeam = true;
				}else{
					$scope.showTeam = false;
				}
			}
		}
	})
	.otherwise({
		redirectTo:'/home'
	})
}]);

//配置根controller，获取程序所需要的数据
app.controller('rootController',function($scope,$http){
	//定义一个变量，保存球员信息
	$scope.playerList  = [];

	//请求数据，得到球员信息列表
	$http({
		method:'get',
		url:'data/players.json'
	}).then(function(response){
		console.log(response.data);
		$scope.playerList = response.data;
	})
});

//自定义过滤器，用于过滤球员位置
app.filter('positionFilter',function(){
	return function(input){
		var s = '';
		switch(input){
			case 'SG':
				s = "得分后卫";
				break;
			case 'PF':
				s = "大前锋";
				break;
			case 'PG':
				s = "控球后卫";
				break;
			case "SF":
				s = "小前锋";
				break;
			case "C":
				s = "中锋";
				break;
		}

		return s+'('+input+')';
	}
});

//自定义过滤器，用来处理排序属性
app.filter("orderFilter",function(){
	return function(input){
		return input==0?'votes':"name";
	}
});

app.directive("voteBtn",function(){
	return{
		restrict:'EA',
		controller:function($scope){

		},
		controllerAs:"btnController",
		template:'<input type="button" value="投票"">',
		replace:true,
		link:function($scope,element){
			element[0].addEventListener('click',function(){
				//手动触发脏检查
				$scope.$apply(function(){
					$scope.player.votes++;
				})
				element[0].setAttribute('disabled','')
			})
			
		}
	}
})