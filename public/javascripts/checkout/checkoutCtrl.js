angular.module('mainApp').controller('checkoutCtrl', ['$scope', '$stateParams', '$rootScope', '$state', 'productService', 'cartRelatedServices', '$q', "$location", function ($scope, $stateParams, $rootScope, $state, productService, cartRelatedServices, $q, $location) {
    $scope.cartDetails = JSON.parse(localStorage.getItem('finalCart'));
    $scope.cartDetailsRefined = [];
    $scope.forms = {};
    $scope.promo = {};
    $scope.promo.code = "";
    $scope.showLoading = false;
    $scope.availableProducts = 0;
    $scope.fewProductsUnavailable = false;
    $rootScope.hideCartFromNavBar = true;
    $scope.totalAmount = 0;
    $rootScope.cartDropDownVisible = false;
    $scope.addressDetails = {};
    $scope.payment = {};
    $scope.payment.cashOnDelivery = true;
    $scope.payment.codCharges = 29;
    $scope.productIds = _.pluck($scope.cartDetails, "productId");
    // onload refines the cart details
    $scope.onload = function () {
        $scope.checkForsizeAvailability();
    }
    $scope.checkForsizeAvailability = function () {
        $scope.getSizes($scope.productIds);
    }
    $scope.saveTempOrder = function () {
        return cartRelatedServices.saveTempOrder($scope.finalCartAvailable, $scope.addressDetails, $scope.totalAmount + $scope.payment.codCharges, $scope.promo.code, $scope.payment.cashOnDelivery);
    };
    $scope.getSizes = function (productIds) {
        var promiseForSize = $q.defer();
        $scope.totalAmount = 0;
        $scope.availableProducts = 0;
        $scope.sizeUnavailableAtFinalStage = false;
        $scope.fewProductsUnavailable = false;
        $scope.finalCartAvailable = [];
        $scope.finalCartNotAvailable = [];
        productService.fetchAvailableSizes(productIds).then(function (response) {
            //    make size object
            $scope.sizesObject = {}
            _.each(response.data.result, function (obj) {
                $scope.sizesObject[obj.id] = obj.sizes;
            });
            // update size object 
            for (var i = 0; i < $scope.cartDetails.length; i++) {
                if ($scope.sizesObject[$scope.cartDetails[i].productId][$scope.cartDetails[i].size] >= $scope.cartDetails[i].quantity) {
                    $scope.cartDetails[i].available = true;
                    $scope.availableProducts++;
                    $scope.totalAmount += $scope.cartDetails[i].quantity * $scope.cartDetails[i].productDetails.price;
                    $scope.finalCartAvailable.push($scope.cartDetails[i]);
                } else {
                    $scope.cartDetails[i].available = false;
                    $scope.fewProductsUnavailable = true;
                    $scope.cartDetails[i].remainingQuantity = $scope.sizesObject[$scope.cartDetails[i].productId][$scope.cartDetails[i].size];
                    $scope.finalCartNotAvailable.push($scope.cartDetails[i]);
                    $scope.sizeUnavailableAtFinalStage = true;
                }
            }
            $scope.cartDetails = $scope.finalCartAvailable;
            $scope.productIds = _.pluck($scope.finalCartAvailable, "productId");
            promiseForSize.resolve({ sizeUnavailableAtFinalStage: $scope.sizeUnavailableAtFinalStage });
            localStorage.setItem('finalCart', JSON.stringify($scope.finalCartAvailable));
            if ($stateParams.src !== "buyNow") {
                localStorage.setItem('cartDetails', JSON.stringify($scope.finalCartAvailable));
                $rootScope.cart.cartDetails = $scope.finalCartAvailable;
                $rootScope.numberOfProductsInCart = $rootScope.cart.cartDetails.length;
                cartRelatedServices.cartDetails = $scope.finalCartAvailable;
            }
        }, function (response) {

        });
        return promiseForSize.promise;
    };
    $scope.checkIfAddressIsAlreadyStoredInDevice = function () {
        var storedAddress = localStorage.getItem('address');
        if (storedAddress) {
            $scope.newAddress = false;
            $scope.addressDetails = JSON.parse(storedAddress);
        } else {
            $scope.newAddress = true;
        }
    };
    $scope.applyPromoCode = function () {
        $scope.promoCodeSuccess = "";
        $scope.promoCodeError = "";
        $scope.promo.promocodeApplied = true;
        if (!$scope.promo.code) {
            $scope.promoCodeError = "Enter Promo Code";
            $scope.promo.promocodeApplied = false;
        } else {
            cartRelatedServices.validatePromoCode($scope.promo.code, $scope.totalAmount, $scope.addressDetails.emailId, $scope.addressDetails.phoneNumber).then((response) => {
                if (response.data.success) {
                    if (response.data.codeAccepted) {
                        $scope.originalAmount = $scope.totalAmount;
                        $scope.totalAmount = parseInt(response.data.updatedAmount);
                        $scope.discount = $scope.originalAmount - $scope.totalAmount;
                        $scope.promoCodeSuccess = response.data.message;
                    } else {
                        $scope.promoCodeError = response.data.message;
                    }
                } else {
                    $scope.promo.promocodeApplied = false;
                    $scope.promoCodeError = "Promo Code Invalid";
                }
            }, () => {
                $scope.promo.promocodeApplied = false;
            })
        }
    }
    $scope.removePromoCode = () => {
        $scope.promo.code = "";
        $scope.promoCodeError = "";
        $scope.promoCodeSuccess = "";
        if ($scope.originalAmount) {
            $scope.totalAmount = $scope.originalAmount;
            $scope.originalAmount = undefined;
        }
        $scope.promo.promocodeApplied = false;
    }
    $scope.makePayment = function () {
        return cartRelatedServices.makePayment($scope.finalCartAvailable, $scope.addressDetails, $scope.totalAmount, $scope.orderId, $scope.promo.code);
    }
    $scope.recordSuccessfulPayment = function (response) {
        return cartRelatedServices.recordSuccessfulPayment($scope.finalCartAvailable, $scope.addressDetails, $scope.totalAmount, $scope.orderId, $scope.promo.code, response);
    }

    $scope.placeOrderAndPayButtonClicked = function () {
        $scope.showErrors = true;
        if (!$scope.newAddress || $scope.forms.addressForm.$valid) {
            localStorage.setItem('address', JSON.stringify($scope.addressDetails));
            // go to payment page get status if status is paid get order id and redirect to orderDetails page
            // check availability and hold products for some time 
            $scope.getSizes($scope.productIds).then(function (res) {
                if (!res.sizeUnavailableAtFinalStage) {
                    if ($scope.originalAmount) $scope.totalAmount = $scope.originalAmount - $scope.discount;
                    // 
                    if ($scope.payment.cashOnDelivery) {
                        // cash on delivery
                        $scope.placeCashOnDelhiveryOrder();
                    } else {
                        // prepaid flow
                        $scope.saveTempOrder().then(function (response) {
                            if (response.data.success) {
                                console.log(response.data);
                                $scope.orderId = response.data.response.orderId;
                                localStorage.setItem('orderid', $scope.orderId);
                                //$scope.showLoading = true;
                                var options = {
                                    "key": "rzp_test_gYXTP715OMzTQU",
                                    "currency": "INR",
                                    "name": "JewelleryBrandName",
                                    "description": "Health is just a step away",
                                    "image": "https://example.com/your_logo",
                                    "order_id": response.data.response.razorPayOrderid,
                                    "handler": function (razorPayResponse) {
                                        $scope.recordSuccessfulPayment({ ...razorPayResponse, ...response.data.response }).then(function (successPaymentResponse) {
                                            // document.getElementById("placeHere").innerHTML = successPaymentResponse.data;
                                            $location.url("/orderStatus");
                                        }, function (failureResponse) {

                                            console.log(failureResponse)
                                        })
                                    },
                                    "prefill": {
                                        "name": $scope.addressDetails.fullName,
                                        "email": $scope.addressDetails.emailId,
                                        "contact": $scope.addressDetails.phoneNumber
                                    },
                                    "notes": {
                                        "address": $scope.addressDetails.address
                                    },
                                    "theme": {
                                        "color": "#F37254"
                                    }
                                };
                                var rzp1 = new Razorpay(options);
                                rzp1.on('payment.failed', function (response) {
                                    console.log(response)
                                });
                                rzp1.open();

                                // $scope.makePayment().then(function (response) {
                                //     document.getElementById("placeHere").innerHTML = response.data;
                                //     // document.getElementById("razorpayform").submit();
                                // }, function () {

                                // });
                            }
                        }, function () { });
                    }
                    // 
                }
            })
            // paymentsStatus = false; 
            // if(paymentsStatus){
            //      localStorage.removeItem('finalCart');
            //     if($stateParams.src !== "buyNow")
            //         {
            //             localStorage.setItem('cartDetails', JSON.stringify([]));
            //             $rootScope.numberOfProductsInCart = 0;
            //         }
            //     $state.go("orderStatus", {orderId: $scope.orderId});
            // }
        } else {

        }
    };
    $scope.$on('$stateChangeStart', function () {
        $rootScope.hideCartFromNavBar = false;
    });
    $scope.differentAddressButton = function () {
        localStorage.removeItem('address');
        $scope.newAddress = true;
        $scope.addressDetails = {};
    };
    // COD
    $scope.toggleCod = function () {
        $scope.payment.cashOnDelivery = !$scope.payment.cashOnDelivery;
        if ($scope.payment.cashOnDelivery) {
            $scope.payment.codCharges = 29;
        } else {
            $scope.payment.codCharges = 0;
        }
    }
    $scope.placeCashOnDelhiveryOrder = function () {
        var orderDetails = {
            products: $scope.finalCartAvailable,
            date: new Date(),
            amount: $scope.totalAmount + $scope.payment.codCharges,
            paymentStatus: "Cash To Be Collected",
            promoCode: $scope.promo.code,
            payment_mode: "Cash To Be Collected",
            orderedBy: {
                name: $scope.addressDetails.fullName,
                emailId: $scope.addressDetails.emailId,
                phoneNo: $scope.addressDetails.phoneNumber
            },
            deliveryDetails: {
                address: $scope.addressDetails.address,
                city: $scope.addressDetails.city,
                state: $scope.addressDetails.state,
                pinCode: $scope.addressDetails.pinCode,
            }
        }
        cartRelatedServices.placeCodOrder(orderDetails).then(function (response) {
            if (!response.data.success) {
                alert("Something went wrong, Please try after some time");
            } else {
                $state.go("orderStatus", { orderId: response.data.orderid });
            }
        }, function () { })
    }
    // flow
    if ($scope.cartDetails === null) {
        $state.go("homePage");
    } else {
        $scope.onload();
        $scope.checkIfAddressIsAlreadyStoredInDevice();
    }
}])