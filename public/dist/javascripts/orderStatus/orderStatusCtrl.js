angular.module("mainApp").controller("orderStatusCtrl",["$scope","$state","CommonServices","$rootScope",function(r,t,e,o){o.hideCartFromNavBar=!0,e.getOrderStatus(t.orderId).then(function(t){r.orderDetails=t}),r.$on("$stateChangeStart",function(r,t,e,a,n,d){o.hideCartFromNavBar=!1})}]);