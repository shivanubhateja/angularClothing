var mainModule = angular.module('mainApp', ['ui.router', 'ngSanitize', 'ngCookies']);

mainModule.run(['$rootScope' ,'productService', 'cartRelatedServices', '$anchorScroll', function($rootScope, productService, cartRelatedServices, $anchorScroll){
    // fetch tags
    productService.fetchTags().then(function(response){
        localStorage.setItem("tags", JSON.stringify(response.tags));
    }, function(response){});
    $anchorScroll.yOffset = 100;
    // check if user is logged in
    // if loggedIn - check cart and update from backend. If backend cart is empty check in localStorage
    // else if not loggedIn - check in local storage and update cart value
    var cart = JSON.parse(localStorage.getItem('cartDetails'));
    if(cart){
        cartRelatedServices.saveCart(cart);
        $rootScope.numberOfProductsInCart = cart.length;
    } else{
        $rootScope.numberOfProductsInCart = 0;
        cartRelatedServices.saveCart([]);
        localStorage.setItem('cartDetails','[]')
    }
    $rootScope.hideCartFromNavBar = false;
}])