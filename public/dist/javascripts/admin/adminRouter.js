angular.module("mainAdminApp").config(["$stateProvider","$locationProvider",function(t,a){t.state({name:"homePage",url:"/admin",templateUrl:"./html/admin/adminHomePage.html"}),t.state({name:"productDetails",url:"/admin/productDetails/:src",templateUrl:"./html/admin/adminProductDetails.html"}),t.state({name:"products",url:"/admin/products/:pageNumber",templateUrl:"./html/admin/adminProducts.html"}),a.html5Mode({enabled:!0,requireBase:!0})}]);