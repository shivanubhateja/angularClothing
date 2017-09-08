angular.module("mainAdminApp").controller("productDetailsCtrl", [
  "$scope",
  "adminServices",
  "$rootScope",
  "$stateParams",
  "$timeout",
  function($scope, adminServices, $rootScope, $stateParams, $timeout) {
    $scope.productDetails = {};
    $scope.$watch("productDetails.images.display", function() {
      $timeout(function() {
        $scope.$digest();
      }, 0);
    });
    $scope.createId = function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
    $scope.fetchProductDetails = function(id) {
      adminServices.fetchProductDetails(id).then(
        function(response) {
          response.data.productDetails.updatedAt = new Date(response.data.productDetails.updatedAt);
          response.data.productDetails.launchedAt = new Date(response.data.productDetails.launchedAt);
          response.data.productDetails.limitedEdition = response.data.productDetails.limitedEdition + "";
          $scope.productDetails = response.data.productDetails;
        },
        function() {}
      );
    };
    $scope.init = function() {
      if ($stateParams.src === "newProduct") {
        $scope.productDetails.id = $scope.createId();
        $scope.productDetails.categoryInfo = {};
        $scope.productDetails.images = {
          display: "",
          additional: []
        };
        $scope.productDetails.sizes = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
        $scope.productDetails.fitDescription = "Slim Fit: Fits closer to the body, take your regular size. Size up if a looser fit is desired";
        $scope.productDetails.materialDescription = '<span><b>Fabric</b> 100% cotton Pique Prewashed to impart a softer texture <b>WashCare Instructions</b> Machine wash cold Do not bleach or wash with chlorine based detergent or water Wash/dry inside out Do not iron directly on prints Dry promptly in shade Dry on a flat surface as hanging may cause measurement variations Product color may vary little due to photography Wash with similar clothes<a href="/faq?query=washcare">Know more</a></span>';
        $scope.productDetails.shippingDescription = '<span>Free Shipping above ₹ 1000 COD charges applicable. Please, refer <a href="/faq">FAQ</a> for more information. All products, except boxers and nightwear shorts, are applicable for return. Customers can return their order within 15 days of the order delivery. Refunds for returned products will be given in your Bewakoof wallet.</span>';
        $scope.productDetails.fit = "Fits just right - not too tight, not too loose.";

        // temp
        // $scope.productDetails = {"categoryInfo":{"gender":"men","superCategory":"top-wear","subCategory":"t-shirt","sleeve":"half"},"images":{"display":"1","additional":{"0":"1","1":"1","2":"1","3":"1","4":"1","5":"1"}},"sizes":{"XS":1,"S":1,"M":1,"L":1,"XL":1,"XXL":1},"fitDescription":"l","materialDescription":"<span><b>Fabric</b> 100% cotton Pique Prewashed to impart a softer texture <b>WashCare Instructions</b> Machine wash cold Do not bleach or wash with chlorine based detergent or water Wash/dry inside out Do not iron directly on prints Dry promptly in shade Dry on a flat surface as hanging may cause measurement variations Product color may vary little due to photography Wash with similar clothes<a href=\"/faq?query=washcare\">Know more</a></span>1","shippingDescription":"<span>Free Shipping above ₹ 1000 COD charges applicable. Please, refer <a href=\"/faq\">FAQ</a> for more information. All products, except boxers and nightwear shorts, are applicable for return. Customers can return their order within 15 days of the order delivery. Refunds for returned products will be given in your Bewakoof wallet.</span>1","fit":"l","name":"l","limitedEdition":"true","updatedAt":new Date("2020-11-10"),"launchedAt":new Date("2020-11-10"),"printed":"true","price":11, "mrp": 11}
        // $scope.productDetails.id = $scope.createId();
      } else {
        // else src will be product id
        $scope.fetchProductDetails($stateParams.src);
      }
    };
    $scope.addProduct = function() {
      if ($stateParams.src === "newProduct") {
        adminServices.addProduct($scope.productDetails).then(
          function(response) {
            console.log(response);
          },
          function(response) {}
        );
      } else {
        adminServices.updateProduct($scope.productDetails).then(function(response) {}, function() {});
      }
    };
    $scope.init();
  }
]);
