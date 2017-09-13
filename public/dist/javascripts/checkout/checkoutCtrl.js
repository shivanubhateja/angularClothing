angular.module("mainApp").controller("checkoutCtrl",["$scope","$stateParams","$rootScope","$state","productService",function(a,t,e,r,s){a.cartDetails=JSON.parse(localStorage.getItem("finalCart")),a.cartDetailsRefined=[],a.forms={},a.availableProducts=0,a.fewProductsUnavailable=!1,e.hideCartFromNavBar=!0,a.totalAmount=0,e.cartDropDownVisible=!1,a.addressDetails={},a.productIds=_.pluck(a.cartDetails,"productId"),a.onload=function(){a.checkForsizeAvailability()},a.checkForsizeAvailability=function(){a.getSizes(a.productIds)},a.getSizes=function(t){a.finalCartAvailable=[],a.finalCartNotAvailable=[],s.fetchAvailableSizes(t).then(function(t){a.sizesObject={},_.each(t.data.result,function(t){a.sizesObject[t.id]=t.sizes});for(var e=0;e<a.cartDetails.length;e++)a.sizesObject[a.cartDetails[e].productId][a.cartDetails[e].size]>=a.cartDetails[e].quantity?(a.cartDetails[e].available=!0,a.availableProducts++,a.totalAmount+=a.cartDetails[e].quantity*a.cartDetails[e].productDetails.price,a.finalCartAvailable.push(a.cartDetails[e])):(a.cartDetails[e].available=!1,a.fewProductsUnavailable=!0,a.cartDetails[e].remainingQuantity=a.sizesObject[a.cartDetails[e].productId][a.cartDetails[e].size],a.finalCartNotAvailable.push(a.cartDetails[e]))},function(a){})},a.checkIfAddressIsAlreadyStoredInDevice=function(){var t=localStorage.getItem("address");t?(a.newAddress=!1,a.addressDetails=JSON.parse(t)):a.newAddress=!0},a.placeOrderAndPayButtonClicked=function(){a.showErrors=!0,a.newAddress&&!a.forms.addressForm.$valid||(localStorage.setItem("address",JSON.stringify(a.addressDetails)),paymentsStatus&&(localStorage.removeItem("finalCart"),"buyNow"!==t.src&&(localStorage.setItem("cartDetails",JSON.stringify([])),e.numberOfProductsInCart=0),r.go("orderStatus",{orderId:"af"})))},a.$on("$stateChangeStart",function(){e.hideCartFromNavBar=!1}),a.differentAddressButton=function(){localStorage.removeItem("address"),a.newAddress=!0,a.addressDetails={}},null===a.cartDetails?r.go("homePage"):(a.onload(),a.checkIfAddressIsAlreadyStoredInDevice())}]);