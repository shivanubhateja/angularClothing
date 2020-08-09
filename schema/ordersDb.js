var mongooseObject = require("../mongooseConfig");

var tempOrdersSchema = mongooseObject.Schema({
  orderId: String,
  products: [],
  date: Date, 
  promoCode: {type: String, default: "N/A"},
  cod: {type: Boolean, default: false},
  razorPayOrderid: String
});

var placedOrdersSchema = mongooseObject.Schema({
  orderId: String,
  products: [],
  date: Date,
  amount: String,
  paymentStatus: String,
  promoCode: {type: String, default: ""},
  orderStatus: {type: String, default: "processing"},
  shipped: {type:Boolean, default: false},
  tracking_id_payment: {type: String, default: "N/A"},
  payment_mode: String,
  bank_ref_no: {type: String, default: "N/A"},
  orderedBy: {
    name: String,
    emailId: String,
    phoneNo: String
  },
  deliveryDetails: {
    address: String,
    city: String,
    state: String,
    country: {type: String, default: "India"},
    pinCode: String,
    preferredTiming: String
  },
  shippingDetails: {
    shippedOn: {type: Date, default: new Date()},
    expectedDelivery: {type: Date, default: new Date()},
    couriourName: {type: String, default: "Delhivery"},
    tracking_number: {type: String, default: "-"},
    tracking_url: {type: String, default: "yet to ship"}
  }
});
module.exports = {
  tempOrderCollection: mongooseObject.model("tempOrders", tempOrdersSchema),
  placedOrdersCollection: mongooseObject.model("placedOrders", placedOrdersSchema)
};
