const Razorpay = require("razorpay");

var instance = new Razorpay({
    key_id: 'rzp_test_gYXTP715OMzTQU',
    key_secret: 'Cyhhr2VDPDiZX2vAet5t9hnj'
});

const createAnOrderInRazorPay = (amount, orderId) => {
    return new Promise((resolve, reject) => {
        var options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: orderId,
            payment_capture: '1'
          };
          instance.orders.create(options, function(err, order) {
              if(err) {
                  console.log("failed to store order in razor pay", err);
                  reject({ success: false, message: "failed to create order in razor pay"});
              } else {
                  console.log(order);
                  resolve({ success: true, order })
              }
          });
    })
}

module.exports = {
    createAnOrderInRazorPay
}