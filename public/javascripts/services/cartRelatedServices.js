angular.module("mainApp").service("cartRelatedServices", [
  "$http",
  function($http) {
    this.cartDetails = [];
    this.saveCart = function(cart) {
      this.cartDetails = cart;
    };
    this.recordSuccessfulPayment = function(cart, address, total, promoCode, cod, razorPayResponse){
      return $http({
        method: "POST",
        url: "/payment/razorPaySuccess",
        data: {
          details: {
            products: cart,
            promoCode: promoCode,
            address: address,
            total: total,
            time: new Date(),
            cod: cod, 
            razorPayResponse
          }
        },
      });
    }
    this.makePayment = function(cart, address, total, order_id) {
      payload = $.param({
        order_id: order_id,
        currency: "INR",
        amount: total,
        language: "en",
        billing_name: address.fullName,
        billing_address: address.address,
        billing_city: address.city,
        billing_state: address.state,
        billing_zip: address.pinCode,
        billing_country: "India",
        billing_tel: address.phoneNumber,
        billing_email: address.emailId
      });
      return $http({
        method: "POST",
        url: "/payment/start",
        data: payload,
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;"}
      });
    };
    this.saveTempOrder = function(cart, address, total, promoCode, cod) {
      return $http({
        method: "POST",
        url: "/api/saveTempOrder",
        data: {
          details: {
            products: cart,
            promoCode: promoCode,
            address: address,
            total: total,
            time: new Date(),
            cod: cod
          }
        }
      });
    };
    // this.addProductToCart = function(product){
    //     // check if product is already there, if not add it , else increase quantity
    //     for(var i=0; i<cartDetails.length; i++){
    //         if(cartDetails[i].productId === product.productId){
    //             cartDetails[i].quantity += product.quantity;
    //             console.log(this.cartDetails);
    //             return true;
    //         } else{
    //             continue;
    //         }
    //     }
    //     this.cartDetails.push(product);
    // };
    this.changeQuantityOfProductInCart = function(product, typeOfChange) {
      // check if product is already there, if not add it , else change quantity
      
      for (var i = 0; i < this.cartDetails.length; i++) {
        if (this.cartDetails[i].productId === product.productId && this.cartDetails[i].size === product.size) {
          if (typeOfChange === "+") this.cartDetails[i].quantity += product.quantity;
          else this.cartDetails[i].quantity -= product.quantity;
          if (this.cartDetails[i].quantity === 0) {
            this.cartDetails[i].quantity.splice(i, 1);
          }
          localStorage.setItem("cartDetails", JSON.stringify(this.cartDetails));
          return true;
        } else {
          continue;
        }
      }
      // add product
      this.cartDetails.push(product);
      localStorage.setItem("cartDetails", JSON.stringify(this.cartDetails));
      return true;
    };
    this.removeProduct = function(product) {
      this.cartDetails = this.cartDetails.filter(function(item) {
        return item.productId !== product.productId || item.size !== product.size;
      });
      localStorage.setItem("cartDetails", JSON.stringify(this.cartDetails));
    };
    this.validatePromoCode = function(promoCode, totalAmount, emailId, phoneNumber){
      return $http({
        method: "GET",
        url: "/api/validatePromoCode?promoCode="+promoCode+"&totalAmount="+totalAmount+"&emailId="+emailId+"&phoneNo="+phoneNumber
      });
    };
    this.placeCodOrder = function(details){
      return $http({
        method: "POST",
        url: '/api/placeCodOrder',
        data: {details: details}
      })
    }
  }
]);
